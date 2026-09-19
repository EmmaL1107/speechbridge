"""Web 层共享配置工具。"""

from __future__ import annotations

import os
from typing import Any

DEFAULT_CORS_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:8501",
    "http://127.0.0.1:8501",
]


def parse_cors_origins(value: str | None = None) -> list[str]:
    """解析 CORS_ALLOWED_ORIGINS。"""
    raw = (value or os.getenv("CORS_ALLOWED_ORIGINS", "")).strip()
    if not raw:
        return list(DEFAULT_CORS_ORIGINS)

    origins = [origin.strip() for origin in raw.split(",") if origin.strip()]
    return origins or list(DEFAULT_CORS_ORIGINS)


def get_cors_middleware_kwargs() -> dict[str, Any]:
    """返回 FastAPI CORSMiddleware 配置。"""
    origins = parse_cors_origins()
    allow_all = "*" in origins

    return {
        "allow_origins": ["*"] if allow_all else origins,
        "allow_credentials": not allow_all,
        "allow_methods": ["*"],
        "allow_headers": ["*"],
    }
