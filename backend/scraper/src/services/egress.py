import logging

import httpx
from schemas.orders import IngestRequest

from config.settings import get_settings

settings = get_settings()
log = logging.getLogger(__name__)


async def call_external_api(data: IngestRequest):
    async with httpx.AsyncClient() as client:
        # headers = {"Authorization": f"Bearer {settings.EXTERNAL_API_KEY}"}
        log.info("Sending egress data " + data.model_dump_json())
        # response = await client.post(
        #     settings.API_ENDPOINT, json=data.model_dump_json()
        # )
        # response.raise_for_status()
