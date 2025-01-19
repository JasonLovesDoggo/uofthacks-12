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
    quantity: Optional[int]


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


async def generate_workflow_node_from_text(prompt: str) -> dict:
    """
    Generates a WorkflowNode object based on a natural language request using the Gemini API.
    """
    try:
        # Define the system prompt to guide the model
        system_prompt = """
        You are a workflow generator. Given a natural language request, generate a valid WorkflowNode object in JSON format.
        The WorkflowNode can be of type "trigger", "condition", or "action". Ensure the structure adheres to the following rules:
        - A "trigger" node starts the workflow.
        - A "condition" node must have a "field", "operator", and "value" in its data.
        - An "action" node must have a "selectedAction" in its data.
        - Each node must have a unique "id" (UUID).
        - Use the "next" field to connect nodes in the workflow.
        
        - Please ensure the response is valid JSON only, no additional text. We do not need formatting or comments.

        Example output:
        {
            "id": "249e053b-eda0-4aeb-899f-ec1a429be22b",
            "type": "trigger",
            "data": {},
            "next": [
                {
                    "id": "03e2e739-874d-42a5-89b2-4b5862f9ba5d",
                    "type": "condition",
                    "data": {
                        "field": "amount",
                        "operator": "greater",
                        "value": "200"
                    },
                    "next": [
                        {
                            "id": "8394f3fa-df42-4848-8b0e-9696efe1ad5a",
                            "type": "action",
                            "data": {
                                "selectedAction": "sendEmail"
                            }
                        }
                    ]
                }
            ]
        }
        """

        # Combine the system prompt with the user's request
        full_prompt = f"{system_prompt}\n\nUser Request: {prompt}"

        # Call the Gemini API
        response = model.generate_content(full_prompt)

        # Parse the response into a Python dictionary
        workflow_node = json.loads(response.text)

        # Validate the structure (basic validation)
        if not isinstance(workflow_node, dict):
            raise ValueError("Invalid response format from Gemini API")

        return workflow_node

    except Exception as e:
        print(f"Error generating workflow node: {e}")
        return None
