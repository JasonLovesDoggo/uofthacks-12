import httpx
from typing import List
from models import IngestRequest


class APIClient:
    def __init__(self, base_url: str):
        self.base_url = base_url
        self.client = httpx.AsyncClient()

    async def send_orders(self, requests: List[IngestRequest]) -> bool:
        try:
            response = await self.client.post(
                f"{self.base_url}/ingest", json=[req.model_dump() for req in requests]
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Error sending orders: {e}")
            return False

    async def close(self):
        await self.client.aclose()
