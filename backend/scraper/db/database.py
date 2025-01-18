from sqlalchemy import (
    create_engine,
    Column,
    UUID,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import uuid
from config.settings import get_settings

Base = declarative_base()

settings = get_settings()


class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Define other fields as per the schema


# Define other models: Account, Session, VerificationToken

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
