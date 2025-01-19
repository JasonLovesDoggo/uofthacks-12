import logging

import httpx
from schemas.orders import IngestRequest

from config.settings import get_settings

settings = get_settings()
log = logging.getLogger(__name__)


async def validate_ingest(data: IngestRequest) -> bool:
    if not all([data.order.total, data.order.merchant]):
        return False
    return True


async def call_external_api(data: IngestRequest):
    if not await validate_ingest(data):
        return
    async with httpx.AsyncClient() as client:
        print(data)
        # headers = {"Authorization": f"Bearer {settings.EXTERNAL_API_KEY}"}
        log.info("Sending egress data " + data.model_dump_json())
        response = await client.post(
            settings.API_ENDPOINT, json=data.model_dump_json()
        )
        response.raise_for_status()
