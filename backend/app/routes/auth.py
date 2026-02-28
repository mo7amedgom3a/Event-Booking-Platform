from fastapi import APIRouter, status, Depends, Response
from datetime import datetime, timezone
import uuid
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse, UserUpdate
from app.models.user import UserRole
from app.services.auth_service import AuthService
from app.dependencies import get_auth_service, get_current_user
router = APIRouter(prefix="/auth", tags=["Authentication"])

def set_cookie(response: Response, token: str):
    # Set the 'HttpOnly', 'Secure', 'SameSite' cookie parameters as best practice
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=30 * 60,  # 30 minutes match token expire
        samesite="lax",
        secure=False, # Set to True in HTTPS production
    )

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    result = await auth_service.register_user(user_in)
    set_cookie(response, result["token"]["access_token"])
    return result

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, response: Response, auth_service: AuthService = Depends(get_auth_service)):
    result = await auth_service.authenticate_user(credentials)
    set_cookie(response, result["token"]["access_token"])
    return result

@router.post("/logout", status_code=status.HTTP_200_OK)
async def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax")
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.get_user_by_id(current_user["id"])

@router.put("/me", response_model=UserResponse)
async def update_current_user_profile(
    user_in: UserUpdate,
    current_user: dict = Depends(get_current_user),
    auth_service: AuthService = Depends(get_auth_service)
):
    return await auth_service.update_user_profile(current_user["id"], user_in)
