"""启动 Web 服务"""

import subprocess
import sys


def main():
    print("=" * 50)
    print("SpeechBridge Web 服务")
    print("=" * 50)
    print()
    print("启动中...")
    print()
    print("FastAPI 后端: http://localhost:8000")
    print("API 文档:     http://localhost:8000/docs")
    print("Streamlit:    http://localhost:8501")
    print()
    print("按 Ctrl+C 停止所有服务")
    print("=" * 50)

    processes = []

    try:
        # 启动 FastAPI
        api_proc = subprocess.Popen(
            [sys.executable, "-m", "uvicorn", "web.api:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        processes.append(("FastAPI", api_proc))

        # 启动 Streamlit
        streamlit_proc = subprocess.Popen(
            [sys.executable, "-m", "streamlit", "run", "web/app.py", "--server.port", "8501",
             "--server.headless", "true"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        processes.append(("Streamlit", streamlit_proc))

        # 等待任一进程退出
        for name, proc in processes:
            proc.wait()

    except KeyboardInterrupt:
        print("\n停止服务...")
        for name, proc in processes:
            proc.terminate()
            proc.wait()
        print("已停止")


if __name__ == "__main__":
    main()
