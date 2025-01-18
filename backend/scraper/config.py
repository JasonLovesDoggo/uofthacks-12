from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    GEMINI_API_KEY: str
    API_ENDPOINT: str
    DATABASE_URL: str
    
    

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return Settings()
