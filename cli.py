"""SpeechBridge CLI 入口"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

import click
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from src.speechbridge.config import PipelineConfig
from src.speechbridge.models import OutputFormat, Scene
from src.speechbridge.pipeline import SpeechBridgePipeline

console = Console()


@click.group()
@click.option("--verbose", "-v", is_flag=True, help="显示详细日志")
def main(verbose: bool):
    """SpeechBridge — 智能语义恢复系统"""
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
        datefmt="%H:%M:%S",
    )


@main.command()
@click.argument("audio_file", type=click.Path(exists=True))
@click.option("--scene", "-s", type=click.Choice([s.value for s in Scene]), default="general", help="应用场景")
@click.option("--output", "-o", type=click.Choice(["text", "json", "tts"]), default="text", help="输出格式")
@click.option("--model", "-m", default=None, help="ASR 模型 (tiny/base/small/medium/large-v3-turbo)")
@click.option("--llm", default=None, help="LLM 提供商 (openai/anthropic/ollama)")
@click.option("--llm-model", default=None, help="LLM 模型名称")
@click.option("--accessibility", "-a", is_flag=True, help="启用语言障碍模式")
def process(audio_file, scene, output, model, llm, llm_model, accessibility):
    """处理音频文件"""
    config = PipelineConfig.from_env()

    # 覆盖配置
    if model:
        config.asr.model = model
    if llm:
        config.recovery.provider = llm
    if llm_model:
        config.recovery.model = llm_model
    config.accessibility.enabled = accessibility

    scene_enum = Scene(scene)
    output_enum = OutputFormat(output)

    console.print(Panel(
        f"[bold]SpeechBridge 处理中...[/bold]\n"
        f"文件: {audio_file}\n"
        f"场景: {scene}\n"
        f"输出: {output}\n"
        f"语言障碍模式: {'✓' if accessibility else '✗'}",
        title="配置",
    ))

    pipeline = SpeechBridgePipeline(config)

    with console.status("[bold green]处理中..."):
        result = pipeline.process(audio_file, scene=scene_enum, output_format=output_enum)

    # 输出结果
    if output == "json":
        console.print(result.output_text)
    else:
        console.print(result.output_text)

    if result.output_audio_path:
        console.print(f"\n🔊 TTS 音频已保存: {result.output_audio_path}")


@main.command()
@click.option("--scene", "-s", type=click.Choice([s.value for s in Scene]), default="general")
@click.option("--output", "-o", type=click.Choice(["text", "json", "tts"]), default="text")
@click.option("--model", "-m", default=None, help="ASR 模型")
@click.option("--llm", default=None, help="LLM 提供商")
@click.option("--accessibility", "-a", is_flag=True, help="启用语言障碍模式")
@click.option("--duration", "-d", default=30, help="录音时长 (秒)")
def listen(scene, output, model, llm, accessibility, duration):
    """实时麦克风录音并处理"""
    try:
        import sounddevice as sd
        import numpy as np
    except ImportError:
        console.print("[red]需要安装 sounddevice: pip install sounddevice[/red]")
        sys.exit(1)

    config = PipelineConfig.from_env()
    if model:
        config.asr.model = model
    if llm:
        config.recovery.provider = llm
    config.accessibility.enabled = accessibility

    scene_enum = Scene(scene)
    output_enum = OutputFormat(output)

    console.print(Panel(
        f"[bold]开始录音...[/bold]\n"
        f"时长: {duration} 秒\n"
        f"场景: {scene}\n"
        f"按 Ctrl+C 提前结束",
        title="录音",
    ))

    try:
        console.print("[yellow]🎤 录音中...[/yellow]")
        audio = sd.rec(
            int(duration * 16000),
            samplerate=16000,
            channels=1,
            dtype="float32",
        )
        sd.wait()
        console.print("[green]✓ 录音完成[/green]")

        # 转为 1D 数组
        audio = audio.flatten()

        pipeline = SpeechBridgePipeline(config)
        with console.status("[bold green]处理中..."):
            result = pipeline.process(audio.tobytes(), filename="recording.wav",
                                      scene=scene_enum, output_format=output_enum)

        console.print(result.output_text)

    except KeyboardInterrupt:
        console.print("\n[yellow]录音已中断[/yellow]")


@main.command()
@click.argument("audio_dir", type=click.Path(exists=True))
@click.option("--output-dir", "-d", type=click.Path(), default="./results", help="输出目录")
@click.option("--scene", "-s", type=click.Choice([s.value for s in Scene]), default="general")
@click.option("--format", "-f", "fmt", type=click.Choice(["text", "json"]), default="json")
def batch(audio_dir, output_dir, scene, fmt):
    """批量处理音频文件"""
    from pathlib import Path

    audio_dir = Path(audio_dir)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    extensions = {".wav", ".mp3", ".m4a", ".flac", ".ogg"}
    audio_files = [f for f in audio_dir.iterdir() if f.suffix.lower() in extensions]

    if not audio_files:
        console.print(f"[red]未找到音频文件: {audio_dir}[/red]")
        return

    console.print(f"找到 {len(audio_files)} 个音频文件")

    config = PipelineConfig.from_env()
    scene_enum = Scene(scene)
    output_enum = OutputFormat(fmt)
    pipeline = SpeechBridgePipeline(config)

    table = Table(title="批处理结果")
    table.add_column("文件", style="cyan")
    table.add_column("原始转录", style="yellow")
    table.add_column("纠正文本", style="green")
    table.add_column("置信度", style="magenta")
    table.add_column("耗时", style="blue")

    for audio_file in audio_files:
        try:
            with console.status(f"[bold green]处理 {audio_file.name}..."):
                result = pipeline.process(str(audio_file), scene=scene_enum, output_format=output_enum)

            # 保存结果
            out_file = output_dir / f"{audio_file.stem}.{fmt}"
            out_file.write_text(result.output_text, encoding="utf-8")

            table.add_row(
                audio_file.name,
                result.asr.text[:50] + ("..." if len(result.asr.text) > 50 else ""),
                result.recovery.corrected_text[:50] + ("..." if len(result.recovery.corrected_text) > 50 else ""),
                f"{result.recovery.confidence:.2f}",
                f"{result.total_time:.1f}s",
            )
        except Exception as e:
            table.add_row(audio_file.name, f"[red]错误: {e}[/red]", "-", "-", "-")

    console.print(table)
    console.print(f"\n结果已保存到: {output_dir}")


@main.command()
def info():
    """显示系统信息"""
    table = Table(title="SpeechBridge 系统信息")
    table.add_column("组件", style="cyan")
    table.add_column("状态", style="green")
    table.add_column("详情")

    # 检查 faster-whisper
    try:
        from faster_whisper import WhisperModel
        table.add_row("faster-whisper", "✓ 已安装", "ASR 引擎就绪")
    except ImportError:
        table.add_row("faster-whisper", "✗ 未安装", "pip install faster-whisper")

    # 检查 silero-vad
    try:
        import torch
        table.add_row("silero-vad", "✓ 已安装", f"PyTorch {torch.__version__}")
    except ImportError:
        table.add_row("silero-vad", "✗ 未安装", "pip install torch")

    # 检查 litellm
    try:
        import litellm
        table.add_row("litellm", "✓ 已安装", "LLM 调用就绪")
    except ImportError:
        table.add_row("litellm", "✗ 未安装", "pip install litellm")

    # 检查 edge-tts
    try:
        import edge_tts
        table.add_row("edge-tts", "✓ 已安装", "TTS 就绪")
    except ImportError:
        table.add_row("edge-tts", "✗ 未安装", "pip install edge-tts")

    console.print(table)


if __name__ == "__main__":
    main()
