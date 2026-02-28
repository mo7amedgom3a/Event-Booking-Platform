import sys
import os
import uuid
import asyncio
from datetime import datetime, timedelta, timezone

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.category import Category
from app.models.event import Event, EventStatus
from app.models.booking import Booking, BookingStatus, PaymentStatus
import bcrypt

def get_password_hash(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

async def seed():
    print("Starting database seeding...", flush=True)
    async with AsyncSessionLocal() as db:
        try:
            from sqlalchemy import select
            result = await db.execute(select(User).limit(1))
            if result.scalars().first():
                print("Database already seeded!", flush=True)
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
            await db.commit()
            print("Users seeded.", flush=True)

            # Seed Categories
            tech_category = Category(name="Technology", slug="technology", description="Tech conferences and meetups")
            music_category = Category(name="Music", slug="music", description="Concerts and festivals")
            sports_category = Category(name="Sports", slug="sports", description="Sporting events and watch parties")
            business_category = Category(name="Business", slug="business", description="Professional business events")
            art_category = Category(name="Arts", slug="arts", description="Art exhibitions and workshops")
            food_category = Category(name="Food", slug="food", description="Food festivals and tastings")
            
            db.add_all([tech_category, music_category, sports_category, business_category, art_category, food_category])
            await db.commit()
            print("Categories seeded.", flush=True)

            # Seed Events
            now = datetime.now(timezone.utc).replace(tzinfo=None) # naive datetime as postgres default usually expects naive UTC or timezone aware if specified
            
            # Tech Events
            event1 = Event(
                title="React Summit 2026",
                description="The largest React conference in Europe. Join 500+ developers for three days of talks, workshops, and networking.",
                category_id=tech_category.id,
                organizer_id=organizer.id,
                location_address="Oosterdok 2, Amsterdam",
                location_city="Amsterdam",
                location_country="Netherlands",
                start_date_time=now + timedelta(days=30),
                end_date_time=now + timedelta(days=32),
                capacity=500,
                available_seats=158,
                price=299.00,
                location_lat=52.3742,
                location_lon=4.9123,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                status=EventStatus.published
            )

            event7 = Event(
                title="AI & Machine Learning Conference",
                description="Deep dive into the world of artificial intelligence with hands-on workshops and keynote speeches.",
                category_id=tech_category.id,
                organizer_id=organizer.id,
                location_address="Sheikh Zayed Road",
                location_city="Dubai",
                location_country="UAE",
                start_date_time=now + timedelta(days=60),
                end_date_time=now + timedelta(days=62),
                capacity=800,
                available_seats=280,
                price=450.00,
                location_lat=25.2144,
                location_lon=55.2811,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
                status=EventStatus.published
            )
            
            # Music Events
            event2 = Event(
                title="Jazz Under the Stars",
                description="An enchanting evening of live jazz music in the heart of Cairo featuring renowned musicians.",
                category_id=music_category.id,
                organizer_id=organizer.id,
                location_address="Salah Salem St",
                location_city="Cairo",
                location_country="Egypt",
                start_date_time=now + timedelta(days=15),
                end_date_time=now + timedelta(days=15, hours=4),
                capacity=300,
                available_seats=20,
                price=75.00,
                location_lat=30.0416,
                location_lon=31.2585,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800",
                status=EventStatus.published
            )

            event8 = Event(
                title="Classical Music Evening",
                description="An evening of timeless classical compositions performed by the Cairo Philharmonic Orchestra.",
                category_id=music_category.id,
                organizer_id=organizer.id,
                location_address="Gezira St",
                location_city="Cairo",
                location_country="Egypt",
                start_date_time=now + timedelta(days=45),
                end_date_time=now + timedelta(days=45, hours=3),
                capacity=400,
                available_seats=90,
                price=120.00,
                location_lat=30.0444,
                location_lon=31.2357,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800",
                status=EventStatus.published
            )
            
            # Sports Events
            event3 = Event(
                title="Premier League Watch Party",
                description="Watch the biggest Premier League matches live on a giant screen with fellow football fans.",
                category_id=sports_category.id,
                organizer_id=organizer.id,
                location_address="12 Kings Road",
                location_city="London",
                location_country="UK",
                start_date_time=now + timedelta(days=10),
                end_date_time=now + timedelta(days=10, hours=3),
                capacity=200,
                available_seats=55,
                price=0.00,
                location_lat=51.4886,
                location_lon=-0.1601,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800",
                status=EventStatus.published
            )

            event9 = Event(
                title="Marathon Training Camp",
                description="A 2-day intensive training camp for marathon runners of all levels with professional coaches.",
                category_id=sports_category.id,
                organizer_id=organizer.id,
                location_address="Central Park",
                location_city="New York",
                location_country="USA",
                start_date_time=now + timedelta(days=25),
                end_date_time=now + timedelta(days=26),
                capacity=100,
                available_seats=33,
                price=85.00,
                location_lat=40.7829,
                location_lon=-73.9654,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800",
                status=EventStatus.published
            )

            # Business Events
            event4 = Event(
                title="Startup Pitch Night",
                description="An exclusive evening where 10 hand-picked startups pitch their ideas to a panel of top investors.",
                category_id=business_category.id,
                organizer_id=organizer.id,
                location_address="Gate Avenue, DIFC",
                location_city="Dubai",
                location_country="UAE",
                start_date_time=now + timedelta(days=20),
                end_date_time=now + timedelta(days=20, hours=4),
                capacity=150,
                available_seats=0,
                price=150.00,
                location_lat=25.2144,
                location_lon=55.2811,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800",
                status=EventStatus.published
            )

            event10 = Event(
                title="Entrepreneurship Workshop",
                description="Learn the fundamentals of building a successful business including market validation and fundraising.",
                category_id=business_category.id,
                organizer_id=organizer.id,
                location_address="Keizersgracht 126",
                location_city="Amsterdam",
                location_country="Netherlands",
                start_date_time=now + timedelta(days=40),
                end_date_time=now + timedelta(days=40, hours=8),
                capacity=50,
                available_seats=2,
                price=0.00,
                location_lat=52.3742,
                location_lon=4.8994,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800",
                status=EventStatus.published
            )

            # Art Events
            event5 = Event(
                title="Contemporary Art Exhibition",
                description="Explore groundbreaking contemporary art from emerging artists around the world.",
                category_id=art_category.id,
                organizer_id=organizer.id,
                location_address="450 Harrison Ave",
                location_city="New York",
                location_country="USA",
                start_date_time=now + timedelta(days=5),
                end_date_time=now + timedelta(days=35),
                capacity=1000,
                available_seats=388,
                price=25.00,
                location_lat=40.7128,
                location_lon=-74.0060,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800",
                status=EventStatus.published
            )

            event11 = Event(
                title="Digital Photography Masterclass",
                description="Master the art of digital photography with hands-on sessions covering composition and lighting.",
                category_id=art_category.id,
                organizer_id=organizer.id,
                location_address="85 Great Eastern St",
                location_city="London",
                location_country="UK",
                start_date_time=now + timedelta(days=50),
                end_date_time=now + timedelta(days=51),
                capacity=30,
                available_seats=8,
                price=199.00,
                location_lat=51.5262,
                location_lon=-0.0822,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800",
                status=EventStatus.published
            )

            # Food Events
            event6 = Event(
                title="Street Food Festival",
                description="A culinary adventure featuring 50+ food vendors from around the world with live cooking demos.",
                category_id=food_category.id,
                organizer_id=organizer.id,
                location_address="Brick Lane",
                location_city="London",
                location_country="UK",
                start_date_time=now + timedelta(days=12),
                end_date_time=now + timedelta(days=14),
                capacity=2000,
                available_seats=1110,
                price=0.00,
                location_lat=51.5226,
                location_lon=-0.0715,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
                status=EventStatus.published
            )

            event12 = Event(
                title="Wine & Cheese Tasting",
                description="An exquisite evening of curated wine and artisan cheese pairings with expert sommeliers.",
                category_id=food_category.id,
                organizer_id=organizer.id,
                location_address="210 W 50th St",
                location_city="New York",
                location_country="USA",
                start_date_time=now + timedelta(days=8),
                end_date_time=now + timedelta(days=8, hours=3),
                capacity=40,
                available_seats=2,
                price=95.00,
                location_lat=40.7615,
                location_lon=-73.9839,
                currency="USD",
                image_url="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
                status=EventStatus.published
            )
            
            db.add_all([event1, event2, event3, event4, event5, event6, event7, event8, event9, event10, event11, event12])
            await db.commit()
            print("Events seeded.", flush=True)

            # Seed Bookings
            booking1 = Booking(
                event_id=event1.id,
                user_id=regular_user.id,
                number_of_seats=2,
                total_amount=598.00,
                status=BookingStatus.confirmed,
                payment_status=PaymentStatus.paid,
                booking_reference=f"BK-{uuid.uuid4().hex[:8].upper()}"
            )
            booking2 = Booking(
                event_id=event2.id,
                user_id=regular_user.id,
                number_of_seats=1,
                total_amount=75.00,
                status=BookingStatus.confirmed,
                payment_status=PaymentStatus.paid,
                booking_reference=f"BK-{uuid.uuid4().hex[:8].upper()}"
            )
            booking3 = Booking(
                event_id=event6.id,
                user_id=regular_user.id,
                number_of_seats=3,
                total_amount=0.00,
                status=BookingStatus.confirmed,
                payment_status=PaymentStatus.paid,
                booking_reference=f"BK-{uuid.uuid4().hex[:8].upper()}"
            )
            booking4 = Booking(
                event_id=event3.id,
                user_id=regular_user.id,
                number_of_seats=1,
                total_amount=0.00,
                status=BookingStatus.cancelled,
                payment_status=PaymentStatus.refunded,
                booking_reference=f"BK-{uuid.uuid4().hex[:8].upper()}"
            )
            booking5 = Booking(
                event_id=event1.id,
                user_id=admin_user.id,
                number_of_seats=4,
                total_amount=1196.00,
                status=BookingStatus.pending,
                payment_status=PaymentStatus.pending,
                booking_reference=f"BK-{uuid.uuid4().hex[:8].upper()}"
            )
            
            db.add_all([booking1, booking2, booking3, booking4, booking5])
            await db.commit()
            print("Bookings seeded.", flush=True)
            
            print("Database seeding completed successfully!", flush=True)

        except Exception as e:
            print(f"An error occurred: {e}", flush=True)
            await db.rollback()

if __name__ == "__main__":
    asyncio.run(seed())
