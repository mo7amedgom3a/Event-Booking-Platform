import uuid
import enum
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class UserRole(str, enum.Enum):
    user = "user"
    organizer = "organizer"
    admin = "admin"

class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.user)

    # Relationships
    events: Mapped[list["Event"]] = relationship("Event", back_populates="organizer", cascade="all, delete-orphan")
    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
