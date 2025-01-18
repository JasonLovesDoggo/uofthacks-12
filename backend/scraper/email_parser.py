from typing import Optional
from models import Order, Merchant, OrderItem


class EmailParser:
    @staticmethod
    def parse_email(email_data: dict) -> Optional[Order]:
        """Parse email data into Order model. Returns None if not an order email."""
        # This is a simplified example - you'd need to implement proper parsing logic
        # for different email formats from different merchants

        try:
            headers = {h["name"]: h["value"] for h in email_data["payload"]["headers"]}
            subject = headers.get("Subject", "")
            body = email_data["payload"]["body"].get("data", "")
            print(body)

            # Example parsing logic - you'd need to expand this based on your needs
            if "order confirmation" not in subject.lower():
                return None

            # Dummy parsing logic - replace with actual implementation
            merchant = Merchant(name="Example Merchant", category="Retail")

            order_items = [OrderItem(name="Example Item", price=99.99, quantity=1)]

            return Order(merchant=merchant, orderItems=order_items, total=99.99)

        except Exception as e:
            print(f"Error parsing email: {e}")
            return None
