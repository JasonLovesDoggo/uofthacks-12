from sqlalchemy import create_engine, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy import Column, Integer, String, DateTime, ARRAY
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from config import get_settings

settings = get_settings()

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()




class User(Base):
    __tablename__ = 'user'

    id = Column(UUID(as_uuid=True), primary_key=True, default=func.uuid_generate_v4())
    name = Column(String)
    email = Column(String, nullable=False, unique=True)
    email_verified = Column(DateTime)
    password = Column(String)
    image = Column(String)
    created_at = Column(DateTime, nullable=False, default=func.now())
    updated_at = Column(DateTime, nullable=False, default=func.now(), onupdate=func.now())

    accounts = relationship("Account", back_populates="user")
    sessions = relationship("Session", back_populates="user")

class Account(Base):
    __tablename__ = 'account'

    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"), nullable=False, primary_key=True)
    type = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    provider_account_id = Column(String, nullable=False)
    refresh_token = Column(String)
    access_token = Column(String)
    expires_at = Column(Integer)
    token_type = Column(String)
    scope = Column(String)
    id_token = Column(String)
    session_state = Column(String)

    user = relationship("User", back_populates="accounts")

    __table_args__ = (
        UniqueConstraint('provider', 'provider_account_id'),
    )

class Session(Base):
    __tablename__ = 'session'

    session_token = Column(String, primary_key=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user.id', ondelete="CASCADE"), nullable=False)
    expires = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")

class VerificationToken(Base):
    __tablename__ = 'verificationToken'

    identifier = Column(String, nullable=False, primary_key=True)
    token = Column(String, nullable=False)
    expires = Column(DateTime, nullable=False)

    __table_args__ = (
        UniqueConstraint('identifier', 'token'),
    )
