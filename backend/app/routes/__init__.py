from .auth import router as auth_router
from .events import router as events_router
from .bookings import router as bookings_router
from .categories import router as categories_router
from .organizer import router as organizer_router

__all__ = [
    "auth_router",
    "events_router",
    "bookings_router",
    "categories_router",
    "organizer_router"
]