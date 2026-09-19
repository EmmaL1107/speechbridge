"""数据库模型"""

from __future__ import annotations

import os
from contextlib import contextmanager
from datetime import datetime
from functools import lru_cache
from pathlib import Path

from sqlalchemy import Column, DateTime, Float, Integer, String, Text, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DB_PATH = os.getenv("DB_PATH", "speechbridge.db")


def resolve_db_path() -> Path:
    path = Path(DB_PATH).expanduser()
    if not path.is_absolute():
        path = PROJECT_ROOT / path
    path.parent.mkdir(parents=True, exist_ok=True)
    return path


@lru_cache
def get_engine():
    """懒加载 SQLAlchemy engine。"""
    return create_engine(
        f"sqlite:///{resolve_db_path()}",
        echo=False,
        connect_args={"check_same_thread": False},
    )


def get_session_factory():
    """获取 sessionmaker。"""
    return sessionmaker(bind=get_engine(), autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    """用户"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password_hash = Column(String(256), nullable=False)

    # 个性化设置
    default_scene = Column(String(50), default="general")
    default_accessibility = Column(Integer, default=0)
    language = Column(String(10), default="zh")

    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    """处理任务"""
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, nullable=True)  # 关联用户 (可选)
    filename = Column(String(255), nullable=False)
    scene = Column(String(50), default="general")
    accessibility = Column(Integer, default=0)

    # ASR 结果
    asr_text = Column(Text, default="")
    asr_confidence = Column(Float, default=0.0)
    asr_language = Column(String(10), default="en")
    asr_duration = Column(Float, default=0.0)

    # 语义恢复结果
    corrected_text = Column(Text, default="")
    intent = Column(Text, default="")
    entities = Column(Text, default="[]")
    actions = Column(Text, default="[]")
    corrections = Column(Text, default="[]")
    recovery_confidence = Column(Float, default=0.0)

    # 元信息
    processing_time = Column(Float, default=0.0)
    status = Column(String(20), default="pending")
    error_message = Column(Text, default="")

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


def init_db():
    """初始化数据库"""
    Base.metadata.create_all(bind=get_engine())


@contextmanager
def get_db() -> Session:
    """获取数据库会话"""
    init_db()
    db = get_session_factory()()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
