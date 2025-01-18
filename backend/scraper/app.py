import uvicorn
from litestar import Litestar
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.services.gmail_service import poll_gmail_accounts
from config.settings import get_settings
import logging

settings = get_settings()

logging.basicConfig(level=logging.INFO)


async def process_emails():
    await poll_gmail_accounts()


async def startup() -> None:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(process_emails, "interval", minutes=5)
    scheduler.start()


app = Litestar(
    route_handlers=[],
    on_startup=[startup],
)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
