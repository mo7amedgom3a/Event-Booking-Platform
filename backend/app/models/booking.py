import uuid
import enum
from sqlalchemy import String, ForeignKey, Numeric, Integer, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    refunded = "refunded"

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"

class Booking(Base, TimestampMixin):
    __tablename__ = "bookings"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    event_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("events.id", ondelete="RESTRICT"))
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="RESTRICT"))
    
    number_of_seats: Mapped[int] = mapped_column(Integer)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2))
    status: Mapped[BookingStatus] = mapped_column(Enum(BookingStatus), default=BookingStatus.pending, index=True)
    payment_status: Mapped[PaymentStatus] = mapped_column(Enum(PaymentStatus), default=PaymentStatus.pending)
    booking_reference: Mapped[str] = mapped_column(String(50), unique=True)

    # Relationships
    event: Mapped["Event"] = relationship("Event", back_populates="bookings")
    user: Mapped["User"] = relationship("User", back_populates="bookings")
