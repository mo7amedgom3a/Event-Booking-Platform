from fastapi import APIRouter, status, Depends
from datetime import datetime, timezone
import uuid
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.models.user import UserRole
from app.services.auth_service import AuthService
from app.dependencies import get_auth_service, get_current_user
router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.register_user(user_in)

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, auth_service: AuthService = Depends(get_auth_service)):
    return await auth_service.authenticate_user(credentials)

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.get_user_by_id(current_user["id"])
