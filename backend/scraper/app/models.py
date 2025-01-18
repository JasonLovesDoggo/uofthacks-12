from pydantic import BaseModel, EmailStr, Field


class Order(BaseModel):
    order_id: str = Field(..., description="Unique identifier for the order")
    customer_email: EmailStr = Field(..., description="Customer's email address")
    total_amount: float = Field(..., description="Total order amount")
    items: list[str] = Field(..., description="List of items ordered")
    timestamp: str = Field(..., description="Order placement timestamp")
