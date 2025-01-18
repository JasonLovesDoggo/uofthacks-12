import json
import logging
from typing import List, Optional, TypedDict
import google.generativeai as genai
from config.settings import get_settings

settings = get_settings()
log = logging.getLogger(__name__)


# Define TypedDict schemas
class Merchant(TypedDict):
    name: str
    category: Optional[str]


class Address(TypedDict):
    street: str
    city: str
    state: str
    code: str
    country: str


class OrderItem(TypedDict):
    name: str
    price: float
    quantity: int


class Order(TypedDict):
    merchant: Merchant
    address: Optional[Address]
    orderItems: List[OrderItem]
    total: float


class OrderDetails(TypedDict):
    email: str
    order: Order


# Configure Gemini API
genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")


def extract_order_details_with_ai(email_content: str) -> OrderDetails:
    prompt = f"""
    Extract order details from the following email content and return it as a JSON object matching the schema. merchant.category is the category of the store, assume it off of the name:
    {email_content}
    """
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=OrderDetails,
        ),
    )

    # Parse the response into the OrderDetails TypedDict
    try:
        order_details: OrderDetails = json.loads(response.text)
        return order_details
    except Exception as e:
        raise ValueError(f"Failed to parse response from Gemini API: {e}")


def detect_if_ecommerce_email(email_content: str) -> bool:
    """
    Detects if the email is an order confirmation email using AI.

    Args:
        email_content (str): The content of the email.

    Returns:
        bool: True if the email is an e-commerce order confirmation, False otherwise.
    """
    # Define the prompt for the Gemini API
    prompt = f"""
    Analyze the following email content and determine if it is an e-commerce order confirmation email. Only return true you can get the total amount in the email body.
    Return only "true" if it is an order confirmation email, otherwise return "false".

    Email Content:
    {email_content}
    """

    # Generate the response using the Gemini API
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", response_schema=bool
        ),
    )
    log.info( # debug
        f"Order {email_content} detected as ecommerce: {response.text.strip().lower()}"
    )

    try:
        result = response.text.strip().lower()
        return "true" in result  # don't need to exactly match result
    except Exception as e:
        raise ValueError(f"Failed to parse response from Gemini API: {e}")
