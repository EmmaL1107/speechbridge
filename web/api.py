"""FastAPI 后端"""

from __future__ import annotations

import asyncio
import logging
from pathlib import Path

from fastapi import FastAPI, File, HTTPException, Query, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

from .cors import get_cors_middleware_kwargs
from .uploads import read_audio_upload

from src.speechbridge.config import PipelineConfig
from src.speechbridge.models import OutputFormat, Scene
from src.speechbridge.pipeline import SpeechBridgePipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="SpeechBridge API",
    description="智能语义恢复系统 — 理解用户想表达什么",
    version="0.1.0",
)

app.add_middleware(CORSMiddleware, **get_cors_middleware_kwargs())

# 全局管线实例
_pipeline: SpeechBridgePipeline | None = None


def get_pipeline() -> SpeechBridgePipeline:
    global _pipeline
    if _pipeline is None:
        _pipeline = SpeechBridgePipeline(PipelineConfig.from_env())
    return _pipeline


@app.get("/")
async def root():
    return {"name": "SpeechBridge", "version": "0.1.0", "status": "running"}


@app.get("/api/scenes")
async def list_scenes():
    """获取支持的场景列表"""
    return {
        "scenes": [
            {"value": "general", "label": "通用", "description": "通用语义恢复"},
            {"value": "meeting", "label": "会议", "description": "提取行动项和决策"},
            {"value": "education", "label": "教育", "description": "课堂讨论和提问理解"},
            {"value": "medical", "label": "医疗", "description": "症状和医疗术语提取"},
            {"value": "accessibility", "label": "无障碍", "description": "语言障碍用户专项处理"},
        ]
    }


@app.get("/api/models")
async def list_models():
    """获取可用模型信息"""
    return {
        "asr_models": ["tiny", "base", "small", "medium", "large-v3-turbo"],
        "llm_providers": ["openai", "anthropic", "ollama"],
        "tts_voices": [
            "en-US-AriaNeural",
            "en-US-GuyNeural",
            "en-GB-SoniaNeural",
            "zh-CN-XiaoxiaoNeural",
        ],
    }


@app.post("/api/process")
async def process_audio(
    file: UploadFile = File(...),
    scene: str = Query("general", description="应用场景"),
    output_format: str = Query("json", description="输出格式: text/json/tts"),
    accessibility: bool = Query(False, description="语言障碍模式"),
):
    """
    处理上传的音频文件.

    - **file**: 音频文件 (WAV, MP3, M4A, FLAC, OGG)
    - **scene**: 应用场景 (general/meeting/education/medical/accessibility)
    - **output_format**: 输出格式 (text/json/tts)
    - **accessibility**: 是否启用语言障碍模式
    """
    # 验证场景
    try:
        scene_enum = Scene(scene)
    except ValueError:
        raise HTTPException(400, f"不支持的场景: {scene}")

    try:
        output_enum = OutputFormat(output_format)
    except ValueError:
        raise HTTPException(400, f"不支持的输出格式: {output_format}")

    content = await read_audio_upload(file, request=None)

    # 处理
    pipeline = get_pipeline()

    try:
        result = pipeline.process(
            content,
            filename=file.filename,
            scene=scene_enum,
            output_format=output_enum,
        )
    except Exception as e:
        logger.error(f"处理失败: {e}", exc_info=True)
        raise HTTPException(500, f"处理失败: {str(e)}")

    # 返回结果
    if output_enum == OutputFormat.TTS and result.output_audio_path:
        return FileResponse(
            result.output_audio_path,
            media_type="audio/mpeg",
            filename="speechbridge_output.mp3",
        )

    return JSONResponse({
        "asr": {
            "text": result.asr.text,
            "confidence": result.asr.segment_confidence,
            "language": result.asr.language,
            "duration": result.asr.duration,
        },
        "recovery": {
            "original_text": result.recovery.original_text,
            "corrected_text": result.recovery.corrected_text,
            "intent": result.recovery.intent,
            "entities": [
                {"name": e.name, "type": e.type, "value": e.value}
                for e in result.recovery.entities
            ],
            "actions": result.recovery.actions,
            "corrections": [
                {"original": c.original, "corrected": c.corrected, "reason": c.reason}
                for c in result.recovery.corrections
            ],
            "confidence": result.recovery.confidence,
            "processing_time": result.recovery.processing_time,
        },
        "total_time": result.total_time,
    })


@app.websocket("/api/stream")
async def stream_audio(websocket: WebSocket):
    """
    WebSocket 实时音频流处理.

    客户端发送音频数据块, 服务端返回识别和恢复结果.
    消息协议:
    - 客户端发送二进制帧: 音频数据 (16kHz mono float32)
    - 客户端发送文本帧: JSON 配置 {"scene": "general", "accessibility": false}
    - 服务端返回文本帧: JSON 结果
    """
    await websocket.accept()
    logger.info("WebSocket 连接已建立")

    scene = Scene.GENERAL
    accessibility = False
    audio_chunks = []

    try:
        while True:
            message = await websocket.receive()

            if "text" in message:
                # 配置消息
                import json
                try:
                    config = json.loads(message["text"])
                    scene = Scene(config.get("scene", "general"))
                    accessibility = config.get("accessibility", False)

                    # 如果收到 finalize 信号, 处理累积的音频
                    if config.get("finalize") and audio_chunks:
                        pipeline = get_pipeline()
                        if accessibility:
                            pipeline.config.accessibility.enabled = True

                        result = pipeline.process_stream(
                            audio_chunks, scene=scene, output_format=OutputFormat.JSON
                        )
                        await websocket.send_text(result.output_text)
                        audio_chunks = []

                except (json.JSONDecodeError, ValueError) as e:
                    await websocket.send_text(json.dumps({"error": str(e)}))

            elif "bytes" in message:
                # 音频数据
                audio_chunks.append(message["bytes"])

    except WebSocketDisconnect:
        logger.info("WebSocket 连接已断开")
    except Exception as e:
        logger.error(f"WebSocket 错误: {e}", exc_info=True)
        try:
            await websocket.close()
        except Exception:
            pass


@app.get("/api/health")
async def health():
    """健康检查"""
    pipeline = get_pipeline()
    return {
        "status": "healthy",
        "asr_loaded": pipeline.asr.is_loaded(),
    }
