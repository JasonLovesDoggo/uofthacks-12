import httpx
from schemas.orders import IngestRequest

from config.settings import get_settings

settings = get_settings()


async def call_external_api(data: IngestRequest):
    async with httpx.AsyncClient() as client:
        # headers = {"Authorization": f"Bearer {settings.EXTERNAL_API_KEY}"}
        response = await client.post(
            settings.EXTERNAL_API_URL, json=data.model_dump_json()
        )
        response.raise_for_status()
