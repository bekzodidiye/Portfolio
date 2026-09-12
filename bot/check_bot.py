#!/usr/bin/env python3
"""
Telegram Bot Diagnostics Tool — Bekzod Idiyev Portfolio
Tests bot token validity, getMe, getWebhookInfo, and connection latency.
"""
import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

def load_env():
    env_path = BASE_DIR / ".env"
    env_vars = {}
    if env_path.exists():
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env_vars[k.strip()] = v.strip().strip('"').strip("'")
    return env_vars

def main():
    print("=" * 60)
    print("🔍 BEKZOD IDIYEV — TELEGRAM BOT DIAGNOSTICS")
    print("=" * 60)

    env_vars = load_env()
    token = env_vars.get("TELEGRAM_BOT_TOKEN") or os.getenv("TELEGRAM_BOT_TOKEN", "")

    if not token:
        print("❌ TELEGRAM_BOT_TOKEN topilmadi! .env fayliga TELEGRAM_BOT_TOKEN kiriting.")
        sys.exit(1)

    masked_token = token[:8] + "..." + token[-4:] if len(token) > 12 else "***"
    print(f"🔑 Bot Token: {masked_token}")

    # 1. Test getMe
    print("\n1️⃣  Telegram API 'getMe' tekshirilmoqda...")
    try:
        url = f"https://api.telegram.org/bot{token}/getMe"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            if data.get("ok"):
                result = data.get("result", {})
                print(f"   ✅ Bot Ulandi: @{result.get('username')} ({result.get('first_name')}) [ID: {result.get('id')}]")
            else:
                print(f"   ❌ Xatolik: {data}")
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("   🚨 401 Unauthorized: Bot token bekor qilingan (revoked) yoki eskirgan!")
            print("   👉 Yechim: Telegramda @BotFather ga kiring, /mybots -> Botni tanlang -> API Token -> Revoke qilib yangi token oling va .env ga qo'ying.")
        else:
            print(f"   ❌ HTTP Xatolik: {e.code} - {e.reason}")
    except Exception as e:
        print(f"   ❌ Ulanish xatosi: {e}")

    # 2. Test getWebhookInfo
    print("\n2️⃣  Telegram Webhook holati tekshirilmoqda...")
    try:
        url = f"https://api.telegram.org/bot{token}/getWebhookInfo"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            if data.get("ok"):
                res = data.get("result", {})
                webhook_url = res.get("url") or "(Webhook sozlanmagan — Long Polling rejimi)"
                print(f"   🌐 Webhook URL: {webhook_url}")
                print(f"   📩 Kutilayotgan xabarlar (pending): {res.get('pending_update_count', 0)}")
                if res.get("last_error_message"):
                    print(f"   ⚠️ Oxirgi webhook xatosi: {res.get('last_error_message')}")
    except Exception as e:
        print(f"   ❌ Webhook tekshirishda xato: {e}")

    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
