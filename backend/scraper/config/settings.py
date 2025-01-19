from functools import lru_cache

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str
    GMAIL_CLIENT_ID: str
    GMAIL_CLIENT_SECRET: str
    API_ENDPOINT: str
    GEMINI_API_KEY: str
    EPOCH_START_TIME: str = '1737248071000' # ignore all emails before this time

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings():
    return Settings()
