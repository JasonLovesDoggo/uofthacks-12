from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from typing import Dict
from datetime import datetime
from models import Account
from database import SessionLocal, AccountDB


class GmailClient:
    def __init__(self):
        self.credentials_store: Dict[str, Credentials] = {}
        self.load_accounts_from_db()

    def load_accounts_from_db(self) -> None:
        """Load all accounts from database."""
        with SessionLocal() as db:
            accounts = db.query(AccountDB).all()
            for account in accounts:
                self._add_account_to_store(Account.model_validate(account.__dict__))

    def _add_account_to_store(self, account: Account) -> None:
        """Add account credentials to memory store."""
        self.credentials_store[account.email] = Credentials(
            token=account.access_token,
            refresh_token=account.refresh_token,
            token_uri=account.token_uri,
            client_id=account.client_id,
            client_secret=account.client_secret,
            scopes=account.scopes,
        )

    def _update_last_check(self, email: str) -> None:
        """Update last_check timestamp in database."""
        with SessionLocal() as db:
            account = db.query(AccountDB).filter(AccountDB.email == email).first()
            if account:
                account.last_check = datetime.utcnow()
                db.commit()

    async def fetch_new_emails(self, email: str) -> list:
        """Fetch new emails from Gmail account."""
        try:
            credentials = self.credentials_store[email]

            # Check if credentials need refresh
            if credentials.expired:
                credentials.refresh(Request())
                # Update token in database
                with SessionLocal() as db:
                    account = (
                        db.query(AccountDB).filter(AccountDB.email == email).first()
                    )
                    if account:
                        account.access_token = credentials.token
                        db.commit()

            service = build("gmail", "v1", credentials=credentials)

            # Update last check time
            self._update_last_check(email)

            results = (
                service.users()
                .messages()
                .list(userId="me", q="in:inbox is:unread")
                .execute()
            )

            messages = results.get("messages", [])
            email_data = []

            for message in messages:
                msg = (
                    service.users()
                    .messages()
                    .get(userId="me", id=message["id"], format="full")
                    .execute()
                )

                email_data.append(msg)

                # Mark as read
                service.users().messages().modify(
                    userId="me", id=message["id"], body={"removeLabelIds": ["UNREAD"]}
                ).execute()

            return email_data

        except Exception as e:
            print(f"Error fetching emails for {email}: {e}")
            return []
