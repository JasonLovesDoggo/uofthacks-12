from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from ..models import Account
from ..ai import extract_order_details_with_ai
from schemas.orders import IngestRequest
from .egress import call_external_api
import logging
from google.auth.transport.requests import Request

from config.settings import get_settings
from ..database import SessionLocal

settings = get_settings()

logging.basicConfig(level=logging.INFO)


def get_gmail_service(credentials):
    return build("gmail", "v1", credentials=credentials, static_discovery=False)


async def poll_gmail_accounts():
    async with SessionLocal() as db:
        accounts = db.query(Account).all()
        for account in accounts:
            creds_info = {
                "refresh_token": account.refresh_token,
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_id": settings.GMAIL_CLIENT_ID,
                "client_secret": settings.GMAIL_CLIENT_SECRET,
                "scopes": ["https://www.googleapis.com/auth/gmail.readonly"],
            }
            creds = Credentials.from_authorized_user_info(info=creds_info)
            if creds.expired and creds.refresh_token:
                creds.refresh(Request())
            service = get_gmail_service(creds)
            try:
                results = (
                    service.users()
                    .messages()
                    .list(userId="me", labelIds=["UNREAD", "INBOX"])
                    .execute()
                )
                messages = results.get("messages", [])
                print(f"Found {len(messages)} new emails; processing...")
                for msg in messages:
                    # Fetch the raw email content
                    msg_data = (
                        service.users()
                        .messages()
                        .get(userId="me", id=msg["id"])
                        .execute()
                    )
                    email_content = msg_data.get("raw", "")
                    print(f"Processing email: {email_content}")
                    # Decode email content if necessary
                    # ...
                    # Process the email content with AI
                    try:
                        order_data = extract_order_details_with_ai(email_content)
                        ingest_request = IngestRequest(**order_data)
                        # Call external API
                        await call_external_api(ingest_request)
                    except Exception as e:
                        logging.error(f"Error processing email: {e}")
            except Exception as e:
                logging.error(f"Error: {e}")
