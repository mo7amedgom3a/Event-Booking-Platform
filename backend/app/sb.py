from sqlalchemy.ext.asyncio import AsyncSession
from app.services.auth_service import AuthService
from app.services.event_service import EventService
from app.services.booking_service import BookingService
from app.services.category_service import CategoryService

class ServiceBase:
    """
    SB object (Service Base). 
    Initializes and holds singleton instances of the services.
    """
    def __init__(self, db: AsyncSession):
        self.auth = AuthService(db)
        self.event = EventService(db)
        self.booking = BookingService(db)
        self.category = CategoryService(db)
