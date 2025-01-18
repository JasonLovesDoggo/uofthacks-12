import asyncio
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from .config_manager import load_accounts
from .gemini_api import is_order_confirmation_gemini, extract_order_data_gemini
from .models import Order
import json

async def fetch_and_process_emails():
    accounts = load_accounts()
    for account in accounts:
        creds_info = account['credentials']
        creds = Credentials.from_authorized_user_info(creds_info)
        service = build('gmail', 'v1', credentials=creds)
        emails = fetch_new_emails(service)
        for email in emails:
            content = get_email_content(email)
            # Use Gemini to determine if it's an order confirmation
            is_order = await is_order_confirmation_gemini(content)
            if is_order:
                # Use Gemini to extract order data
                order_data = await extract_order_data_gemini(content)
                try:
                    order = Order(**order_data)
                    # Send the order data to the external API
                    await send_order_to_api(order)
                    # Optionally, mark the email as read or archive it
                except ValueError as e:
                    print(f"Error creating order model: {e}")
