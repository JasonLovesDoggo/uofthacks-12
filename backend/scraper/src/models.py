from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class Merchant(BaseModel):
    name: str
    category: Optional[str] = None


class OrderItem(BaseModel):
    name: str
    price: float
    quantity: int


class Order(BaseModel):
    merchant: Merchant
    address: Optional[str] = None
    orderItems: List[OrderItem]
    total: float


class IngestRequest(BaseModel):
    email: EmailStr
    order: Order


class Account(BaseModel):
    id: int
    email: EmailStr
    access_token: str
    refresh_token: str
    token_uri: str
    client_id: str
    client_secret: str
    scopes: List[str]
    last_check: datetime
