"""音频上传校验工具。"""

from __future__ import annotations

import io
import mimetypes
import os
import uuid
from pathlib import Path

from fastapi import HTTPException, Request, UploadFile
from pydub import AudioSegment
import soundfile as sf

from src.speechbridge.audio.loader import SUPPORTED_FORMATS

DEFAULT_MAX_UPLOAD_BYTES = 25 * 1024 * 1024
ALLOWED_AUDIO_MIME_TYPES = {
    "audio/wav",
    "audio/x-wav",
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/m4a",
    "audio/flac",
    "audio/ogg",
    "audio/webm",
    "audio/opus",
    "application/octet-stream",
}


def get_max_upload_bytes() -> int:
    raw = os.getenv("MAX_UPLOAD_BYTES")
    if not raw:
        return DEFAULT_MAX_UPLOAD_BYTES
    try:
        value = int(raw)
    except ValueError as exc:
        raise ValueError("MAX_UPLOAD_BYTES 必须是正整数") from exc
    if value <= 0:
        raise ValueError("MAX_UPLOAD_BYTES 必须是正整数")
    return value


def parse_upload_limit_bytes() -> int:
    try:
        return get_max_upload_bytes()
    except ValueError as exc:
        raise HTTPException(500, str(exc)) from exc


def ensure_under_upload_limit(content_length: int | None, limit_bytes: int) -> None:
    if content_length is not None and content_length > limit_bytes:
        raise HTTPException(413, f"上传文件过大，最大允许 {limit_bytes} bytes")


def _safe_filename(filename: str | None) -> str:
    if not filename:
        return f"{uuid.uuid4().hex}.wav"

    name = Path(filename).name.strip()
    if not name or name in {".", ".."}:
        return f"{uuid.uuid4().hex}.wav"

    suffix = Path(name).suffix.lower()
    if suffix not in SUPPORTED_FORMATS:
        raise HTTPException(415, "不支持的音频文件格式")

    return f"{uuid.uuid4().hex}{suffix}"


def sanitize_audio_filename(filename: str | None) -> str:
    """生成安全的上传文件名，只保留受支持的音频扩展名。"""
    return _safe_filename(filename)


def _guess_mime_type(filename: str | None, content_type: str | None) -> str | None:
    if content_type:
        return content_type.lower()
    if filename:
        return mimetypes.guess_type(filename)[0]
    return None


def _probe_audio_content(filename: str | None, content: bytes) -> None:
    suffix = Path(filename or "").suffix.lower() if filename else ""

    try:
        if suffix == ".wav" or not suffix:
            sf.read(io.BytesIO(content), dtype="float32")
            return

        fmt = suffix.lstrip(".") or None
        AudioSegment.from_file(io.BytesIO(content), format=fmt)
    except Exception as exc:
        raise HTTPException(415, "音频文件内容无法解析") from exc


def validate_audio_upload(
    filename: str | None,
    content_type: str | None,
    content: bytes,
) -> None:
    """校验音频上传：大小由调用方检查，这里检查空文件、扩展名、MIME 和内容。"""
    if not content:
        raise HTTPException(400, "文件为空")

    suffix = Path(filename or "").suffix.lower()
    if suffix not in SUPPORTED_FORMATS:
        raise HTTPException(415, "不支持的音频文件格式")

    mime_type = _guess_mime_type(filename, content_type)
    if mime_type not in ALLOWED_AUDIO_MIME_TYPES:
        raise HTTPException(415, "不支持的音频 MIME 类型")

    if mime_type == "application/octet-stream" and suffix not in SUPPORTED_FORMATS:
        raise HTTPException(415, "不支持的音频文件格式")

    _probe_audio_content(filename, content)


async def read_audio_upload(file: UploadFile, request: Request | None = None) -> bytes:
    """按上传限制读取音频文件并校验。"""
    limit_bytes = parse_upload_limit_bytes()

    if request is not None:
        raw_length = request.headers.get("content-length")
        if raw_length:
            try:
                ensure_under_upload_limit(int(raw_length), limit_bytes)
            except ValueError as exc:
                raise HTTPException(400, str(exc)) from exc

    chunks: list[bytes] = []
    total = 0
    while True:
        chunk = await file.read(1024 * 1024)
        if not chunk:
            break
        total += len(chunk)
        if total > limit_bytes:
            raise HTTPException(413, f"上传文件过大，最大允许 {limit_bytes} bytes")
        chunks.append(chunk)

    content = b"".join(chunks)
    validate_audio_upload(file.filename, file.content_type, content)
    return content
