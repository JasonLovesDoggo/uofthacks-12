import aiohttp

from app.main import API_URL
from models import Order

async def send_order_to_api(order: Order) -> None:
    async with aiohttp.ClientSession() as session:
        headers = {'Content-Type': 'application/json'}
        data = order.model_dump_json()
        async with session.post(API_URL, headers=headers, data=data) as response:
            if response.status != 200:
                print(f"Failed to send order to API: {response.status} {response.reason}")
                pass
