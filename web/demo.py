"""SpeechBridge Demo — 前后端一体"""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from datetime import datetime
from pathlib import Path

from fastapi import BackgroundTasks, Cookie, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

from src.speechbridge.config import PipelineConfig
from src.speechbridge.models import OutputFormat, Scene
from src.speechbridge.pipeline import SpeechBridgePipeline

from .cors import get_cors_middleware_kwargs
from .uploads import read_audio_upload, sanitize_audio_filename

from .auth import clear_auth_cookie, get_current_user, hash_password, set_auth_cookie, verify_password
from .database import Task, User, get_db, init_db
from .i18n import t as _t

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SpeechBridge Demo", version="0.1.0")
app.add_middleware(CORSMiddleware, **get_cors_middleware_kwargs())

BASE_DIR = Path(__file__).parent
# HF Spaces 等容器环境用 /tmp 持久化上传文件
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", str(BASE_DIR.parent / "uploads")))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(BASE_DIR / "static")), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# 注册翻译函数到 Jinja2
templates.env.globals["t"] = _t

_pipeline: SpeechBridgePipeline | None = None
_model_loading = False


def get_pipeline() -> SpeechBridgePipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = SpeechBridgePipeline(PipelineConfig.from_env())
    return _pipeline


def get_lang(request: Request) -> str:
    """获取当前语言"""
    user = get_current_user(request)
    if user:
        with get_db() as db:
            db_user = db.query(User).filter(User.id == user["uid"]).first()
            if db_user:
                return db_user.language
    return request.cookies.get("lang", "zh")


def get_user_or_none(request: Request):
    """获取当前用户对象 (或 None)"""
    u = get_current_user(request)
    if not u:
        return None
    with get_db() as db:
        return db.query(User).filter(User.id == u["uid"]).first()


def ctx(request: Request, **extra):
    """构建模板上下文"""
    lang = get_lang(request)
    user = get_user_or_none(request)
    base = {"request": request, "lang": lang, "user": user}
    base.update(extra)
    return base


# ── 启动 ─────────────────────────────────────────────────────
@app.on_event("startup")
def startup():
    init_db()
    logger.info("数据库已初始化")

    def preload():
        global _model_loading
        _model_loading = True
        try:
            get_pipeline().asr._ensure_loaded()
            logger.info("Whisper 模型加载完成")
        except Exception as e:
            logger.error(f"模型预加载失败: {e}")
        finally:
            _model_loading = False

    threading.Thread(target=preload, daemon=True).start()


# ── 后台处理 ─────────────────────────────────────────────────
def process_audio_task(task_id: int, file_path: str, scene: str, accessibility: bool):
    pipeline = get_pipeline()
    request_config = pipeline.config.model_copy(deep=True)
    request_config.accessibility.enabled = accessibility
    start = time.time()
    try:
        result = pipeline.process(
            file_path,
            scene=Scene(scene),
            output_format=OutputFormat.JSON,
            config=request_config,
        )
    except Exception as e:
        logger.error(f"任务 {task_id} 失败: {e}", exc_info=True)
        with get_db() as db:
            task = db.query(Task).filter(Task.id == task_id).first()
            if task:
                task.status = "error"
                task.error_message = str(e)
        return

    elapsed = time.time() - start
    with get_db() as db:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            return
        task.asr_text = result.asr.text
        task.asr_confidence = result.asr.segment_confidence
        task.asr_language = result.asr.language
        task.asr_duration = result.asr.duration
        task.corrected_text = result.recovery.corrected_text
        task.intent = result.recovery.intent
        task.entities = json.dumps([{"name": e.name, "type": e.type, "value": e.value} for e in result.recovery.entities], ensure_ascii=False)
        task.actions = json.dumps(result.recovery.actions, ensure_ascii=False)
        task.corrections = json.dumps([{"original": c.original, "corrected": c.corrected, "reason": c.reason} for c in result.recovery.corrections], ensure_ascii=False)
        task.recovery_confidence = result.recovery.confidence
        task.processing_time = elapsed
        task.status = "done"
        logger.info(f"任务 {task_id} 完成, 耗时 {elapsed:.2f}s")


# ── 页面路由 ─────────────────────────────────────────────────
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse(request, "index.html", ctx(request))


@app.get("/history", response_class=HTMLResponse)
async def history(request: Request):
    user = get_current_user(request)
    with get_db() as db:
        if user:
            tasks = db.query(Task).filter(Task.user_id == user["uid"]).order_by(Task.created_at.desc()).limit(50).all()
        else:
            tasks = db.query(Task).filter(Task.user_id == None).order_by(Task.created_at.desc()).limit(50).all()
    return templates.TemplateResponse(request, "history.html", ctx(request, tasks=tasks))


@app.get("/task/{task_id}", response_class=HTMLResponse)
async def task_detail(request: Request, task_id: int):
    with get_db() as db:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(404)
        entities = json.loads(task.entities) if task.entities else []
        actions = json.loads(task.actions) if task.actions else []
        corrections = json.loads(task.corrections) if task.corrections else []
    return templates.TemplateResponse(request, "detail.html", ctx(request,
        task=task,
        entities=entities,
        actions=actions,
        corrections=corrections,
    ))


# ── 语言切换 ─────────────────────────────────────────────────
@app.get("/lang/{lang}")
async def switch_lang(request: Request, lang: str):
    if lang not in ("zh", "en"):
        lang = "zh"
    # 如果已登录, 保存到用户设置
    user = get_current_user(request)
    if user:
        with get_db() as db:
            db_user = db.query(User).filter(User.id == user["uid"]).first()
            if db_user:
                db_user.language = lang
    resp = RedirectResponse(url=request.headers.get("referer", "/"), status_code=303)
    resp.set_cookie("lang", lang, max_age=86400 * 365)
    return resp


# ── 登录 ─────────────────────────────────────────────────────
@app.get("/login", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(request, "login.html", ctx(request))


@app.post("/login")
async def login_submit(request: Request, username: str = Form(...), password: str = Form(...)):
    with get_db() as db:
        user = db.query(User).filter(User.username == username).first()
        if not user or not verify_password(password, user.password_hash):
            return templates.TemplateResponse(request, "login.html", ctx(request, error="用户名或密码错误"))
    resp = RedirectResponse(url="/", status_code=303)
    set_auth_cookie(resp, user.id, user.username)
    return resp


# ── 注册 ─────────────────────────────────────────────────────
@app.get("/register", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(request, "register.html", ctx(request))


@app.post("/register")
async def register_submit(
    request: Request,
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    confirm_password: str = Form(...),
):
    if password != confirm_password:
        return templates.TemplateResponse(request, "register.html", ctx(request, error="两次密码不一致"))
    if len(password) < 6:
        return templates.TemplateResponse(request, "register.html", ctx(request, error="密码至少 6 位"))

    with get_db() as db:
        if db.query(User).filter(User.username == username).first():
            return templates.TemplateResponse(request, "register.html", ctx(request, error="用户名已存在"))
        if db.query(User).filter(User.email == email).first():
            return templates.TemplateResponse(request, "register.html", ctx(request, error="邮箱已注册"))

        user = User(
            username=username,
            email=email,
            password_hash=hash_password(password),
            language=get_lang(request),
        )
        db.add(user)
        db.refresh(user)

    resp = RedirectResponse(url="/", status_code=303)
    set_auth_cookie(resp, user.id, user.username)
    return resp


@app.get("/logout")
async def logout(request: Request):
    resp = RedirectResponse(url="/", status_code=303)
    clear_auth_cookie(resp)
    return resp


# ── 个人设置 ─────────────────────────────────────────────────
@app.get("/profile", response_class=HTMLResponse)
async def profile_page(request: Request):
    user = get_user_or_none(request)
    if not user:
        return RedirectResponse(url="/login", status_code=303)
    return templates.TemplateResponse(request, "profile.html", ctx(request, saved=False))


@app.post("/profile")
async def profile_save(
    request: Request,
    default_scene: str = Form("general"),
    default_accessibility: str = Form("0"),
    language: str = Form("zh"),
):
    user_obj = get_current_user(request)
    if not user_obj:
        return RedirectResponse(url="/login", status_code=303)

    with get_db() as db:
        user = db.query(User).filter(User.id == user_obj["uid"]).first()
        user.default_scene = default_scene
        user.default_accessibility = 1 if default_accessibility == "1" else 0
        user.language = language

    resp = RedirectResponse(url="/profile", status_code=303)
    resp.set_cookie("lang", language, max_age=86400 * 365)
    return resp


# ── API ──────────────────────────────────────────────────────
@app.post("/api/upload")
async def upload_audio(
    background_tasks: BackgroundTasks,
    request: Request,
    file: UploadFile = File(...),
    scene: str = Form("general"),
    accessibility: bool = Form(False),
):
    content = await read_audio_upload(file, request)
    safe_name = sanitize_audio_filename(file.filename)
    save_path = UPLOAD_DIR / safe_name

    with open(save_path, "wb") as f:
        f.write(content)

    user = get_current_user(request)
    with get_db() as db:
        task = Task(
            user_id=user["uid"] if user else None,
            filename=safe_name,
            scene=scene,
            accessibility=1 if accessibility else 0,
            status="processing",
        )
        db.add(task)
        db.refresh(task)

    background_tasks.add_task(process_audio_task, task.id, str(save_path), scene, accessibility)
    return JSONResponse({"task_id": task.id})


@app.get("/api/task/{task_id}/status")
async def task_status(task_id: int):
    with get_db() as db:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(404)
    return {"id": task.id, "status": task.status}


@app.delete("/api/task/{task_id}")
async def delete_task(task_id: int):
    with get_db() as db:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise HTTPException(404)
        file_path = UPLOAD_DIR / task.filename
        if file_path.exists():
            file_path.unlink()
        db.delete(task)
    return {"ok": True}


# ── TTS 朗读 ────────────────────────────────────────────────
TTS_VOICES = {
    "zh": "zh-CN-XiaoxiaoNeural",
    "en": "en-US-AriaNeural",
}

import hashlib

TTS_CACHE_DIR = UPLOAD_DIR / "tts_cache"
TTS_CACHE_DIR.mkdir(parents=True, exist_ok=True)


@app.get("/api/tts")
async def tts(text: str, voice: str = "zh-CN-XiaoxiaoNeural", lang: str = "zh"):
    if not text.strip():
        raise HTTPException(400, "text is required")

    # 如果目标语言和文本语言不同，先翻译
    tts_text = text
    _llm_provider = os.getenv("LLM_PROVIDER", "deepseek")
    _llm_model = {
        "dashscope": "openai/qwen-plus",
        "deepseek": "deepseek/deepseek-chat",
        "openai": "openai/gpt-4o-mini",
        "anthropic": "anthropic/claude-3-haiku-20240307",
    }.get(_llm_provider, "deepseek/deepseek-chat")

    _llm_kwargs = {}
    if _llm_provider == "dashscope":
        _llm_kwargs["api_base"] = "https://dashscope.aliyuncs.com/compatible-mode/v1"
        os.environ["OPENAI_API_KEY"] = os.getenv("DASHSCOPE_API_KEY", "")

    if lang == "en" and any('一' <= c <= '鿿' for c in text):
        # 中文文本 → 翻译成英文再朗读
        try:
            import litellm

            resp = await litellm.acompletion(
                model=_llm_model,
                messages=[
                    {"role": "system", "content": "Translate the user's text to natural English. Output ONLY the translation, nothing else."},
                    {"role": "user", "content": text},
                ],
                temperature=0.3,
                **_llm_kwargs,
            )
            tts_text = resp.choices[0].message.content.strip()
            logger.info(f"TTS 翻译: {text[:30]}... → {tts_text[:30]}...")
        except Exception as e:
            logger.error(f"TTS 翻译失败: {e}")
            raise HTTPException(500, "Translation failed")
    elif lang == "zh" and all(('一' > c or c > '鿿') for c in text if c.strip()):
        # 英文文本 → 翻译成中文再朗读
        try:
            import litellm

            resp = await litellm.acompletion(
                model=_llm_model,
                messages=[
                    {"role": "system", "content": "将用户文本翻译成自然的中文。只输出翻译结果，不要其他内容。"},
                    {"role": "user", "content": text},
                ],
                temperature=0.3,
                **_llm_kwargs,
            )
            tts_text = resp.choices[0].message.content.strip()
            logger.info(f"TTS 翻译: {text[:30]}... → {tts_text[:30]}...")
        except Exception as e:
            logger.error(f"TTS 翻译失败: {e}")
            raise HTTPException(500, "Translation failed")

    # 用 text+voice+lang 的 hash 做缓存 key
    cache_key = hashlib.md5(f"{text}:{voice}:{lang}".encode()).hexdigest()
    cache_path = TTS_CACHE_DIR / f"{cache_key}.mp3"

    if not cache_path.exists() or cache_path.stat().st_size < 100:
        import edge_tts

        try:
            communicate = edge_tts.Communicate(tts_text, voice)
            await communicate.save(str(cache_path))
        except Exception as e:
            logger.error(f"TTS 生成失败 (voice={voice}): {e}")
            if cache_path.exists():
                cache_path.unlink()
            raise HTTPException(500, f"TTS generation failed")

    from fastapi.responses import FileResponse

    resp = FileResponse(str(cache_path), media_type="audio/mpeg")
    resp.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    resp.headers["Pragma"] = "no-cache"
    return resp
