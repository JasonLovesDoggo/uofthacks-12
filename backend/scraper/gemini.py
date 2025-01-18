import google.generativeai as genai
from typing import Optional
from models import Order
import json
from config import get_settings


class GeminiClient:
    def __init__(self):
        settings = get_settings()
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel("gemini-2.0-flash-exp")

    async def is_order_email(self, email_content: str) -> bool:
        prompt = f"""
        Analyze this email and determine if it's an order confirmation email.
        Response should be exactly "true" or "false".

        Email:
        {email_content}
        """

        response = await self.model.generate_content_async(prompt)
        return response.text.strip().lower() == "true"

    async def parse_order(self, email_content: str) -> Optional[Order]:
        order_schema = {
            "merchant": {"name": "string", "category": "string (optional)"},
            "address": "string (optional)",
            "orderItems": [{"name": "string", "price": "number", "quantity": "number"}],
            "total": "number",
        }

        prompt = f"""
        Parse this order confirmation email into JSON format matching this structure:
        {json.dumps(order_schema, indent=2)}

        Email:
        {email_content}

        Ensure the output is valid JSON only, no additional text.
        """

        try:
            response = await self.model.generate_content_async(prompt)
            order_dict = json.loads(response.text)
            return Order.model_validate(order_dict)
        except Exception as e:
            print(f"Error parsing order with Gemini: {e}")
            return None
