import google.generativeai as genai
import typing_extensions as typing

from schemas.orders import Order

from config.settings import get_settings

settings = get_settings()


# Define the response schema using TypedDict
class OrderDetails(typing.TypedDict):
    email: str
    order: Order


client = genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-pro-latest")


def extract_order_details_with_ai(email_content: str) -> OrderDetails:
    prompt = f"""
    Extract order details from the following email content and return it as a JSON object matching the schema:
    {email_content}
    """
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=OrderDetails,
        ),
    )
    return response
