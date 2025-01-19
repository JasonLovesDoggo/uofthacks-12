import base64
import traceback

from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from ..ai import extract_order_details_with_ai, detect_if_ecommerce_email
from schemas.orders import IngestRequest
from .egress import call_external_api
import logging
from google.auth.transport.requests import Request
from sqlalchemy.future import select
from config.settings import get_settings
from ..database import async_session, Account

settings = get_settings()

log = logging.getLogger(__name__)


def get_gmail_service(credentials):
    return build("gmail", "v1", credentials=credentials, static_discovery=False)


def extract_email_content(payload):
    """
    Extracts the email content from the payload.
    """
    if 'parts' in payload:
        for part in payload['parts']:
            if part['mimeType'] == 'text/plain':
                body = part['body']['data']
                return base64.urlsafe_b64decode(body).decode('utf-8')
            elif part['mimeType'] == 'text/html':
                body = part['body']['data']
                return base64.urlsafe_b64decode(body).decode('utf-8')
            elif 'parts' in part:
                # Recursively handle nested parts
                return extract_email_content(part)
    else:
        if payload['mimeType'] == 'text/plain' or payload['mimeType'] == 'text/html':
            body = payload['body']['data']
            return base64.urlsafe_b64decode(body).decode('utf-8')
    return ""


async def poll_gmail_accounts():
    async with async_session() as db:
        # Use select statement and get scalars to get actual model instances
        stmt = select(Account)
        results = await db.execute(stmt)
        accounts = results.scalars().all()

        logging.info(f"Found {len(accounts)} accounts to process")

        # Iterate over the actual Account instances
        for account in accounts:
            creds_info = {
                "refresh_token": account.refresh_token,
                "token_uri": "https://oauth2.googleapis.com/token",
                "client_id": settings.GMAIL_CLIENT_ID,
                "client_secret": settings.GMAIL_CLIENT_SECRET,
                "scopes": ["https://www.googleapis.com/auth/gmail.readonly"],
            }

            if not account.access_token:
                logging.warning(
                    f"Account {account.userId} has no refresh token, skipping"
                )
                continue

            try:
                creds = Credentials.from_authorized_user_info(info=creds_info)
                if creds.expired and creds.refresh_token:
                    creds.refresh(Request())

                service = get_gmail_service(creds)

                results = (
                    service.users()
                    .messages()
                    .list(userId="me", labelIds=["UNREAD", "INBOX"], maxResults=10)
                    .execute()
                )

                messages = results.get("messages", [])
                logging.info(
                    f"Found {len(messages)} new emails for account {account.userId}"
                )

                for msg in messages:
                    try:
                        msg_data = (
                            service.users()
                            .messages()
                            .get(userId="me", id=msg["id"], format="full")
                            .execute()
                        )
                        if msg_data["internalDate"] <= settings.EPOCH_START_TIME:
                            # email was sent before start time of this project
                            continue

                        email_content = extract_email_content(msg_data.get("payload", {}))

                        # print(f"{account.userId}: {email_content=}")
                        if not detect_if_ecommerce_email(email_content):
                            log.debug(f"NOT ECOMMERCE: {email_content[:20]}")
                            continue

                        # Process the email content with AI
                        order_data = extract_order_details_with_ai(email_content)
                        ingest_request = IngestRequest.model_construct(**order_data)
                        await call_external_api(ingest_request)

                    except Exception as e:
                        logging.error(
                            f"Error processing email {msg['id']} for account {account.userId}: {e}"
                        )
                        print(traceback.format_exc())

            except Exception as e:
                logging.error(f"Error processing account {account.userId}: {e}")
