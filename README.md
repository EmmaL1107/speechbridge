---
title: SpeechBridge
emoji: 🫶
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---

# SpeechBridge — 智能语义恢复系统

> 理解用户想表达什么，而不仅仅是识别说了什么。

SpeechBridge 是一个面向真实世界复杂语音输入的智能语义恢复系统。在发音偏移、语言障碍以及不确定表达条件下，仍能够恢复用户真实意图，并输出清晰、准确、可理解的沟通结果。

## 核心特性

- 🎯 **语义恢复** — 从错误的语音识别结果中推断用户真实意图
- 🌍 **口音友好** — 支持各种非标准英语口音
- ♿ **无障碍支持** — 语言障碍用户的专项处理
- 🏢 **场景适配** — 会议、教育、医疗等场景的差异化处理
- 🔊 **多格式输出** — 文本、JSON 结构化数据、TTS 语音

## 架构

```
语音输入 → 音频预处理 → VAD → ASR (Whisper) → 后处理 → LLM 语义恢复 → 输出
```

## 快速开始

### 安装

```bash
# 克隆项目
git clone <repo-url>
cd speechbridge

# 安装依赖
pip install -e ".[dev]"

# 配置环境变量
cp .env.example .env
# 编辑 .env, 设置 LLM API key
```

### 使用

```bash
# 处理音频文件
python cli.py process audio.wav

# 指定场景
python cli.py process audio.wav --scene meeting --output json

# 语言障碍模式
python cli.py process audio.wav --accessibility

# 实时麦克风录音
python cli.py listen --duration 30

# 批量处理
python cli.py batch ./audio_files/ --output-dir ./results/

# 查看系统信息
python cli.py info
```

### Python API

```python
from src.speechbridge.pipeline import SpeechBridgePipeline
from src.speechbridge.config import PipelineConfig

config = PipelineConfig.from_env()
pipeline = SpeechBridgePipeline(config)

result = pipeline.process("audio.wav")
print(result.recovery.corrected_text)
print(result.recovery.intent)
```

### Web 界面

```bash
# 启动 FastAPI + Streamlit
python web/run.py

# 或分别启动
uvicorn web.api:app --reload --port 8000   # API: http://localhost:8000/docs
streamlit run web/app.py                     # UI: http://localhost:8501
```

**API 端点**:
- `POST /api/process` — 上传音频处理
- `WS /api/stream` — WebSocket 实时音频流
- `GET /api/scenes` — 场景列表
- `GET /api/models` — 可用模型
- `GET /api/health` — 健康检查

## 技术栈

| 组件 | 技术 |
|------|------|
| ASR | faster-whisper (large-v3-turbo) |
| VAD | silero-vad |
| 语义恢复 | LLM (Claude / GPT / Ollama) |
| TTS | edge-tts |
| Web | FastAPI + Streamlit |

## 项目结构

```
speechbridge/
├── src/speechbridge/
│   ├── audio/          # 音频预处理 (加载, VAD, 降噪)
│   ├── asr/            # ASR 引擎 (Whisper)
│   ├── recovery/       # 语义恢复 (LLM)
│   ├── output/         # 输出格式化 (文本, JSON, TTS)
│   ├── config.py       # 配置管理
│   ├── models.py       # 数据模型
│   └── pipeline.py     # 主管线
├── web/
│   ├── api.py          # FastAPI 后端
│   ├── app.py          # Streamlit 前端
│   └── run.py          # 启动脚本
├── cli.py              # 命令行入口
├── tests/              # 测试
└── examples/           # 示例
```

## 目标用户

1. **国际交流用户** — 口音较重但表达完整的用户
2. **语言障碍用户** — 口吃、构音障碍、神经系统疾病患者
3. **AI 交互用户** — 通过语音与 AI 系统交互的用户
4. **会议/教育用户** — 多人发言、专业术语场景

## License

MIT
