import sys
import os
import uuid
from datetime import datetime, timedelta, timezone

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.event import Event, EventStatus
from app.models.booking import Booking, BookingStatus, PaymentStatus
import bcrypt

def get_password_hash(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def seed():
    print("Starting database seeding...")
    db = SessionLocal()
    try:
        # Check if users already exist
        if db.query(User).first():
            print("Database already seeded!")
            return

        # Seed Users
        admin_user = User(
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            role=UserRole.admin
        )
        
        organizer = User(
            email="organizer@example.com",
            password_hash=get_password_hash("org123"),
            first_name="Event",
            last_name="Organizer",
            role=UserRole.organizer
        )
        
        regular_user = User(
            email="user@example.com",
            password_hash=get_password_hash("user123"),
            first_name="Regular",
            last_name="User",
            role=UserRole.user
        )
        
        db.add_all([admin_user, organizer, regular_user])
        db.commit()
        print("Users seeded.")

        # Seed Categories
        tech_category = Category(name="Technology", slug="technology", description="Tech conferences and meetups")
        music_category = Category(name="Music", slug="music", description="Concerts and festivals")
        art_category = Category(name="Art", slug="art", description="Art exhibitions and workshops")
        
        db.add_all([tech_category, music_category, art_category])
        db.commit()
        print("Categories seeded.")

        # Seed Events
        now = datetime.now(timezone.utc).replace(tzinfo=None) # naive datetime as postgres default usually expects naive UTC or timezone aware if specified
        event1 = Event(
            title="Tech Conference 2026",
            description="The biggest tech conference of the year.",
            category_id=tech_category.id,
            organizer_id=organizer.id,
            location_address="123 Convention Center Blvd",
            location_city="San Francisco",
            location_country="USA",
            start_date_time=now + timedelta(days=30),
            end_date_time=now + timedelta(days=32),
            capacity=1000,
            available_seats=998,
            price=299.99,
            location_lat=37.7749,
            location_lon=-122.4194,
            currency="USD",
            status=EventStatus.published
        )
        
        event2 = Event(
            title="Jazz Night",
            description="A night of smooth jazz.",
            category_id=music_category.id,
            organizer_id=organizer.id,
            location_address="456 Music Hall St",
            location_city="New York",
            location_country="USA",
            start_date_time=now + timedelta(days=15),
            end_date_time=now + timedelta(days=15, hours=4),
            capacity=200,
            available_seats=200,
            price=50.00,
            location_lat=40.7128,
            location_lon=-74.0060,
            currency="USD",
            status=EventStatus.published
        )
        
        db.add_all([event1, event2])
        db.commit()
        print("Events seeded.")

        # Seed Bookings
        booking1 = Booking(
            event_id=event1.id,
            user_id=regular_user.id,
            number_of_seats=2,
            total_amount=599.98,
            status=BookingStatus.confirmed,
            payment_status=PaymentStatus.paid,
            booking_reference=f"REF-{uuid.uuid4().hex[:8].upper()}"
        )
        
        db.add_all([booking1])
        db.commit()
        print("Bookings seeded.")
        
        print("Database seeding completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
