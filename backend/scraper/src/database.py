from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from config.settings import get_settings
from sqlalchemy import ForeignKey, UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, create_session

settings = get_settings()

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
engine = create_async_engine(SQLALCHEMY_DATABASE_URL)
async_session = async_sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

sync_engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = create_session(autocommit=False, autoflush=False, bind=sync_engine)


class User(Base):
    __tablename__ = "user"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String)
    email = Column(String, nullable=False, unique=True)
    emailVerified = Column(DateTime)
    password = Column(String)
    image = Column(String)
    createdAt = Column(DateTime, nullable=False, server_default=func.now())
    updatedAt = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    accounts = relationship(
        "Account", back_populates="user", cascade="all, delete-orphan"
    )
    sessions = relationship(
        "Session", back_populates="user", cascade="all, delete-orphan"
    )

    class Config:
        from_attributes = True


class Account(Base):
    __tablename__ = "account"

    userId = Column(
        UUID(as_uuid=True),
        ForeignKey("user.id", ondelete="CASCADE"),
        nullable=False,
        primary_key=True,
    )
    type = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    providerAccountId = Column(String, nullable=False)
    refresh_token = Column(String)
    access_token = Column(String)
    expires_at = Column(Integer)
    token_type = Column(String)
    scope = Column(String)
    id_token = Column(String)
    session_state = Column(String)

    # Relationship
    user = relationship("User", back_populates="accounts")

    class Config:
        from_attributes = True


class Session(Base):
    __tablename__ = "session"

    sessionToken = Column(String, primary_key=True)
    userId = Column(
        UUID(as_uuid=True), ForeignKey("user.id", ondelete="CASCADE"), nullable=False
    )
    expires = Column(DateTime, nullable=False)

    # Relationship
    user = relationship("User", back_populates="sessions")

    class Config:
        from_attributes = True


class VerificationToken(Base):
    __tablename__ = "verificationToken"

    identifier = Column(String, nullable=False)
    token = Column(String, nullable=False, primary_key=True)
    expires = Column(DateTime, nullable=False)

    class Config:
        from_attributes = True
