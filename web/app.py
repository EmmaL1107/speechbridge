"""Streamlit 前端"""

from __future__ import annotations

import json
import tempfile
from pathlib import Path

import streamlit as st

from src.speechbridge.config import PipelineConfig
from src.speechbridge.models import OutputFormat, Scene
from src.speechbridge.pipeline import SpeechBridgePipeline


@st.cache_resource
def load_pipeline():
    """加载管线 (缓存)"""
    config = PipelineConfig.from_env()
    return SpeechBridgePipeline(config)


def main():
    st.set_page_config(
        page_title="SpeechBridge",
        page_icon="🌉",
        layout="wide",
    )

    st.title("🌉 SpeechBridge")
    st.caption("智能语义恢复系统 — 理解你想表达什么，而不仅仅是识别你说了什么")

    # 侧边栏配置
    with st.sidebar:
        st.header("⚙️ 配置")

        scene = st.selectbox(
            "应用场景",
            options=[s.value for s in Scene],
            format_func={
                "general": "🌐 通用",
                "meeting": "🏢 会议",
                "education": "📚 教育",
                "medical": "🏥 医疗",
                "accessibility": "♿ 无障碍",
            }.get,
            index=0,
        )

        accessibility = st.toggle("语言障碍模式", value=False)

        st.divider()

        output_format = st.radio(
            "输出格式",
            options=["text", "json"],
            index=0,
        )

        st.divider()

        st.markdown("### 📖 使用说明")
        st.markdown("""
        1. 上传音频文件或录制语音
        2. 选择应用场景
        3. 查看语义恢复结果

        **支持格式**: WAV, MP3, M4A, FLAC, OGG
        """)

    # 主区域: 两列布局
    col_input, col_output = st.columns(2)

    with col_input:
        st.header("🎤 输入")

        # 输入方式选择
        input_method = st.radio(
            "输入方式",
            options=["upload", "record"],
            format_func={"upload": "📁 上传文件", "record": "🎙️ 实时录音"}.get,
            horizontal=True,
        )

        audio_data = None
        filename = None

        if input_method == "upload":
            uploaded = st.file_uploader(
                "上传音频文件",
                type=["wav", "mp3", "m4a", "flac", "ogg"],
                help="支持 WAV, MP3, M4A, FLAC, OGG 格式",
            )
            if uploaded:
                audio_data = uploaded.read()
                filename = uploaded.name
                st.audio(audio_data, format=f"audio/{uploaded.name.split('.')[-1]}")

        else:
            recorded = st.audio_input("录制语音")
            if recorded:
                audio_data = recorded.read()
                filename = "recording.wav"
                st.audio(audio_data, format="audio/wav")

    with col_output:
        st.header("📝 输出")

        if audio_data and st.button("🚀 开始处理", type="primary", use_container_width=True):
            pipeline = load_pipeline()

            if accessibility:
                pipeline.config.accessibility.enabled = True

            scene_enum = Scene(scene)
            output_enum = OutputFormat(output_format)

            with st.spinner("处理中..."):
                try:
                    result = pipeline.process(
                        audio_data,
                        filename=filename,
                        scene=scene_enum,
                        output_format=output_enum,
                    )
                except Exception as e:
                    st.error(f"处理失败: {e}")
                    return

            # 存储结果到 session state
            st.session_state["result"] = result

        # 显示结果
        if "result" in st.session_state:
            result = st.session_state["result"]

            # 原始转录 vs 纠正文本
            st.subheader("对比")
            col_orig, col_fixed = st.columns(2)

            with col_orig:
                st.markdown("**原始转录**")
                st.info(result.asr.text if result.asr.text else "(无)")

            with col_fixed:
                st.markdown("**纠正后文本**")
                st.success(result.recovery.corrected_text if result.recovery.corrected_text else "(无)")

            # 意图
            if result.recovery.intent:
                st.subheader("🎯 意图")
                st.write(result.recovery.intent)

            # 实体
            if result.recovery.entities:
                st.subheader("📦 提取的实体")
                entity_data = [
                    {"名称": e.name, "类型": e.type, "值": e.value}
                    for e in result.recovery.entities
                ]
                st.dataframe(entity_data, use_container_width=True)

            # 纠正详情
            if result.recovery.corrections:
                st.subheader("🔧 纠正详情")
                for c in result.recovery.corrections:
                    st.markdown(f'- "{c.original}" → "{c.corrected}" _{c.reason}_')

            # 行动项
            if result.recovery.actions:
                st.subheader("📋 行动项")
                for i, a in enumerate(result.recovery.actions, 1):
                    st.markdown(f"{i}. {a}")

            # 元信息
            st.divider()
            meta_cols = st.columns(4)
            with meta_cols[0]:
                st.metric("ASR 置信度", f"{result.asr.segment_confidence:.2f}")
            with meta_cols[1]:
                st.metric("恢复置信度", f"{result.recovery.confidence:.2f}")
            with meta_cols[2]:
                st.metric("语义恢复耗时", f"{result.recovery.processing_time:.2f}s")
            with meta_cols[3]:
                st.metric("总耗时", f"{result.total_time:.2f}s")

            # JSON 原始数据
            with st.expander("🔍 查看原始 JSON 数据"):
                st.json(json.loads(result.output_text) if output_format == "json"
                        else {"text": result.output_text})


if __name__ == "__main__":
    main()
