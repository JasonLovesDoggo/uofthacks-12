import json

import aiohttp
from typing import Dict
import os

GEMINI_API_URL = os.environ.get("GEMINI_API_URL")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

async def is_order_confirmation_gemini(email_content: str) -> bool:
    async with aiohttp.ClientSession() as session:
        prompt = f"Is this email an order confirmation? Answer 'Yes' or 'No'.\n\nEmail content:\n{email_content}"
        data = {
            "prompt": prompt,
            "api_key": GEMINI_API_KEY
        }
        async with session.post(GEMINI_API_URL, json=data) as response:
            result = await response.json()
            return result['answer'].lower() == 'yes'

async def extract_order_data_gemini(email_content: str) -> Dict:
    async with aiohttp.ClientSession() as session:
        prompt = f"Extract the order data from the following email and return it in JSON format with keys: order_id, customer_email, total_amount, items, timestamp.\n\nEmail content:\n{email_content}"
        data = {
            "prompt": prompt,
            "api_key": GEMINI_API_KEY
        }
        async with session.post(GEMINI_API_URL, json=data) as response:
            result = await response.json()
            try:
                return json.loads(result['answer'])
            except json.JSONDecodeError:
                return {}
