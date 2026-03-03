import uuid
import enum
from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, Numeric, Integer, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin

class EventStatus(str, enum.Enum):
    draft = "draft"
    published = "published"
    cancelled = "cancelled"
    completed = "completed"

class Event(Base, TimestampMixin):
    __tablename__ = "events"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    category_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("categories.id", ondelete="RESTRICT"))
    organizer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    
    # Location details
    location_address: Mapped[str] = mapped_column(String(255))
    location_city: Mapped[str] = mapped_column(String(100), index=True)
    location_country: Mapped[str] = mapped_column(String(100))
    location_lat: Mapped[float | None] = mapped_column(Numeric(10, 8))
    location_lon: Mapped[float | None] = mapped_column(Numeric(11, 8))
    
    start_date_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_date_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    capacity: Mapped[int] = mapped_column(Integer)
    available_seats: Mapped[int] = mapped_column(Integer)
    price: Mapped[float] = mapped_column(Numeric(10, 2))
    currency: Mapped[str] = mapped_column(String(3), default="USD")
    status: Mapped[EventStatus] = mapped_column(Enum(EventStatus), default=EventStatus.draft, index=True)
    image_url: Mapped[str | None] = mapped_column(String(500))

    # Relationships
    category: Mapped["Category"] = relationship("Category", back_populates="events")
    organizer: Mapped["User"] = relationship("User", back_populates="events")
    bookings: Mapped[list["Booking"]] = relationship("Booking", back_populates="event", cascade="all, delete-orphan")

    @property
    def location(self):
        return {
            "address": self.location_address,
            "city": self.location_city,
            "country": self.location_country,
            "coordinates": {
                "latitude": float(self.location_lat) if self.location_lat is not None else None,
                "longitude": float(self.location_lon) if self.location_lon is not None else None,
            } if (self.location_lat is not None or self.location_lon is not None) else None
        }
