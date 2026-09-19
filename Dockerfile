FROM python:3.11-slim

WORKDIR /app

# 系统依赖（ffmpeg 给 pydub/soundfile 用）
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg && rm -rf /var/lib/apt/lists/*

# 安装项目依赖（hatchling 需要 README.md）
COPY pyproject.toml README.md ./
COPY src/ src/
RUN pip install --no-cache-dir .[web]

# 复制 web 层
COPY web/ web/
COPY data/ data/

# 创建必要目录
RUN mkdir -p uploads/tts_cache

# 环境变量（默认用阿里 SenseVoice + Qwen）
ENV DB_PATH=/tmp/speechbridge.db
ENV UPLOAD_DIR=/tmp/uploads
ENV ASR_MODEL=sensevoice-v1
ENV LLM_PROVIDER=dashscope
ENV PYTHONPATH=/app

EXPOSE 7860

CMD ["uvicorn", "web.demo:app", "--host", "0.0.0.0", "--port", "7860"]
