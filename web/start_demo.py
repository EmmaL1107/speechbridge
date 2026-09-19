"""启动 SpeechBridge Demo (HTTPS + PWA)"""

import os
import subprocess
import sys
from pathlib import Path

from dotenv import load_dotenv

# 加载 .env (必须在导入其他模块之前)
base = Path(__file__).parent.parent
load_dotenv(base / ".env")


def main():
    cert = base / "web" / "certs" / "cert.pem"
    key = base / "web" / "certs" / "key.pem"

    print("=" * 55)
    print("  🌉 SpeechBridge Demo (HTTPS)")
    print("=" * 55)
    print()
    print(f"  地址: https://localhost:8000")
    print(f"  局域网: https://0.0.0.0:8000")
    print()
    print("  ⚠️  首次打开浏览器会提示「不安全」")
    print("     点击「高级」→「继续访问」即可")
    print()
    print("  📱 手机访问: 用电脑局域网 IP + :8000")
    print("     Chrome 地址栏右侧可安装为桌面应用")
    print()
    print("  按 Ctrl+C 停止")
    print("=" * 55)

    subprocess.run([
        sys.executable, "-m", "uvicorn",
        "web.demo:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--ssl-keyfile", str(key),
        "--ssl-certfile", str(cert),
        "--reload",
    ])


if __name__ == "__main__":
    main()
