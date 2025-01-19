from pydantic import BaseModel, EmailStr
from typing import List, Optional


class Merchant(BaseModel):
    name: str
    category: Optional[str] = None


class Address(BaseModel):
    number: str
    street: str
    city: str
    province: str
    code: str
    country: str


class OrderItem(BaseModel):
    name: str
    price: float
    quantity: int


class Order(BaseModel):
    merchant: Merchant
    address: Optional[Address] = None
    orderItems: List[OrderItem]
    total: float


class IngestRequest(BaseModel):
    email: EmailStr
    order: Order
