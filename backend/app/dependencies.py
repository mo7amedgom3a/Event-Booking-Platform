from fastapi import Request, Depends, HTTPException, status
from typing import List
from app.services.auth_service import AuthService
from app.services.event_service import EventService
from app.services.booking_service import BookingService
from app.services.category_service import CategoryService

def get_auth_service(request: Request) -> AuthService:
    return request.app.state.sb.auth

def get_event_service(request: Request) -> EventService:
    return request.app.state.sb.event

def get_booking_service(request: Request) -> BookingService:
    return request.app.state.sb.booking

def get_category_service(request: Request) -> CategoryService:
    return request.app.state.sb.category

def get_current_user(request: Request) -> dict:
    user_data = request.state.user
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user_data

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return current_user
