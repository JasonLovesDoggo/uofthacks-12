from litestar import Litestar, get
from litestar.openapi import OpenAPIConfig
from litestar.openapi.plugins import (
    RapidocRenderPlugin,
    SwaggerRenderPlugin,
    StoplightRenderPlugin,
)
from litestar.response import Response
from litestar.status_codes import HTTP_200_OK

from credentials.database import SessionLocal
from models import IngestRequest
from gmail import GmailClient
from gemini import GeminiClient
from egress import APIClient
from config import get_settings
import asyncio
import base64

settings = get_settings()
gmail_client = GmailClient()
gemini_client = GeminiClient()
api_client = APIClient(settings.API_ENDPOINT)


def extract_email_content(email_data: dict) -> str:
    """Extract email content from Gmail API response."""
    try:
        payload = email_data.get("payload", {})
        parts = payload.get("parts", [])
        if not parts:
            body = payload.get("body", {})
            if "data" in body:
                return base64.urlsafe_b64decode(body["data"]).decode("utf-8")
            return ""

        for part in parts:
            if part.get("mimeType") == "text/plain":
                body = part.get("body", {})
                if "data" in body:
                    return base64.urlsafe_b64decode(body["data"]).decode("utf-8")

        body = parts[0].get("body", {})
        if "data" in body:
            return base64.urlsafe_b64decode(body["data"]).decode("utf-8")

        return ""
    except Exception as e:
        print(f"Error extracting email content: {e}")
        return ""


async def process_emails():
    while True:
        # Reload accounts from database
        gmail_client.load_accounts_from_db()

        try:
            for email in gmail_client.credentials_store.keys():
                try:
                    emails = await gmail_client.fetch_new_emails(email)
                    requests = []

                    for email_data in emails:
                        email_content = extract_email_content(email_data)

                        if await gemini_client.is_order_email(email_content):
                            order = await gemini_client.parse_order(email_content)
                            if order:
                                request = IngestRequest(email=email, order=order)
                                requests.append(request)

                    if requests:
                        await api_client.send_orders(requests)

                except Exception as e:
                    print(f"Error processing emails for {email}: {e}")

            await asyncio.sleep(60)
        except Exception as e:
            print(f"Error in process_emails: {e}")
            await asyncio.sleep(60)


@get("/accounts")
async def list_accounts() -> Response:
    with SessionLocal() as db:
        accounts = db.query(AccountDB).all()
        return Response(
            content={
                "accounts": [
                    {"email": account.email, "last_check": account.last_check}
                    for account in accounts
                ]
            },
            status_code=HTTP_200_OK,
        )


async def startup_event():
    asyncio.create_task(process_emails())


app = Litestar(
    route_handlers=[list_accounts],
    on_startup=[startup_event],
    openapi_config=OpenAPIConfig(
        title="Email Ingestion Service",
        version="0.1.0",
        path="docs",
        render_plugins=[
            RapidocRenderPlugin(),
            SwaggerRenderPlugin(),
            StoplightRenderPlugin(),
        ],
    ),
    debug=True,
)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
