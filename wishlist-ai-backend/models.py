# Concepts to research:

# SQLAlchemy Mapped and mapped_column syntax for type hinting
# Character length requirements for storing Argon2 hashed passwords
# Timestamp configurations using server_default in SQLAlchemy

from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String, DateTime, func
from datetime import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] =  mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)  # Adjust length for Argon2 hash. Using PHC string format which can be quite long, so 255 is a safe choice.
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())