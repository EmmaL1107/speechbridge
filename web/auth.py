"""用户认证"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import time
from functools import wraps

from fastapi import HTTPException, Request, Response

from .database import User

MIN_SECRET_LENGTH = 32
WEAK_SECRETS = {
    "",
    "speechbridge-secret-key-change-me",
    "change-me",
    "secret",
    "password",
}


class ConfigurationError(RuntimeError):
    """认证配置错误。"""


def get_auth_secret() -> str:
    """获取并校验 AUTH_SECRET。"""
    secret = os.getenv("AUTH_SECRET", "").strip()
    if secret in WEAK_SECRETS or len(secret) < MIN_SECRET_LENGTH:
        raise ConfigurationError(
            "AUTH_SECRET 未配置或过弱，请设置至少 32 字节的随机密钥"
        )
    return secret


def hash_password(password: str) -> str:
    """密码哈希"""
    salt = get_auth_secret()[:16]
    return hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()


def verify_password(password: str, password_hash: str) -> bool:
    """验证密码"""
    return hash_password(password) == password_hash


def create_token(user_id: int, username: str) -> str:
    """创建简单 JWT-like token"""
    payload = json.dumps({"uid": user_id, "user": username, "exp": time.time() + 86400 * 7})
    import base64
    data = base64.urlsafe_b64encode(payload.encode()).decode()
    sig = hmac.new(get_auth_secret().encode(), data.encode(), hashlib.sha256).hexdigest()[:32]
    return f"{data}.{sig}"


def verify_token(token: str) -> dict | None:
    """验证 token"""
    try:
        import base64
        parts = token.split(".")
        if len(parts) != 2:
            return None
        data, sig = parts
        expected = hmac.new(get_auth_secret().encode(), data.encode(), hashlib.sha256).hexdigest()[:32]
        if not hmac.compare_digest(sig, expected):
            return None
        payload = json.loads(base64.urlsafe_b64decode(data + "=="))
        if payload["exp"] < time.time():
            return None
        return payload
    except Exception:
        return None


def get_current_user(request: Request) -> dict | None:
    """从 cookie 获取当前用户"""
    token = request.cookies.get("token")
    if not token:
        return None
    return verify_token(token)


def set_auth_cookie(response: Response, user_id: int, username: str):
    """设置登录 cookie"""
    token = create_token(user_id, username)
    secure = os.getenv("AUTH_COOKIE_SECURE", "false").lower() in {"1", "true", "yes"}
    response.set_cookie(
        "token",
        token,
        max_age=86400 * 7,
        httponly=True,
        secure=secure,
        samesite="lax",
    )


def clear_auth_cookie(response: Response):
    """清除登录 cookie"""
    response.delete_cookie("token")
