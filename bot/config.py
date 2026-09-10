import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory
BASE_DIR = Path(__file__).resolve().parent.parent

class BotConfig(BaseSettings):
    """
    Configuration settings loaded from .env or environment variables.
    """
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_CHAT_ID: str = os.getenv("TELEGRAM_CHAT_ID", "5678281376")
    ADMIN_IDS: list[int] = [5678281376]
    
    # Portfolio WebApp URL
    PORTFOLIO_URL: str = "https://bekzod-idiyev-portfolio.vercel.app"

    GITHUB_URL: str = "https://github.com/bekzodidiye"
    TELEGRAM_CHANNEL: str = "https://t.me/toyneden"
    
    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

config = BotConfig()
