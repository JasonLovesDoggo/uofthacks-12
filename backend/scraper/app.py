import sys
from datetime import datetime, UTC

import uvicorn
from apscheduler.job import Job
from litestar import Litestar, post, get
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from litestar.openapi import OpenAPIConfig
from litestar.openapi.plugins import ScalarRenderPlugin
from litestar.controller import Controller

from schemas.tasks import JobDetailsResponse
from src.services.gmail_service import poll_gmail_accounts
from config.settings import get_settings
import logging

settings = get_settings()
logging.basicConfig(
    level=logging.DEBUG,  # Set the log level to DEBUG
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",  # Log format
    handlers=[
        logging.FileHandler("app.log"),  # Write logs to a file
        logging.StreamHandler(sys.stdout),  # Write logs to the terminal
    ],
)
logging.getLogger("googleapicliet.discovery_cache").setLevel(logging.ERROR)
scheduler = AsyncIOScheduler()

job: Job = None


async def process_emails():
    await poll_gmail_accounts()


async def startup() -> None:
    global job
    job = scheduler.add_job(
        process_emails,
        "interval",
        minutes=5,
        # next_run_time=datetime.now(UTC),
        misfire_grace_time=30,
        max_instances=1,
    )
    scheduler.start()


class EmailProcessingController(Controller):
    path = "/task/process_emails"

    @post("/trigger")
    async def trigger_process_emails(self) -> JobDetailsResponse:
        global job
        job.modify(next_run_time=datetime.now())
        return self.get_response(job)

    @get("/next_run")
    async def get_next_run_time(self) -> JobDetailsResponse:
        global job
        if job:
            return self.get_response(job)
        else:
            return {"error": "No job scheduled"}

    def get_response(self, job: Job) -> JobDetailsResponse:
        return {
            "id": job.id,
            "next_run_time": str(job.next_run_time),
            "time_util_next_run": (job.next_run_time - datetime.now(UTC)).seconds,
            "interval": job.trigger.interval.total_seconds(),
        }


app = Litestar(
    route_handlers=[EmailProcessingController],
    on_startup=[startup],
    debug=True,
    openapi_config=OpenAPIConfig(
        title="Email Processor API",
        version="1.0",
        description="API to trigger email processing task",
        path="docs",
        render_plugins=[ScalarRenderPlugin()],
    ),
)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
