from fastapi import APIRouter, status, Depends
from datetime import datetime, timezone
import uuid
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.models.user import UserRole

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate):
    mock_user = UserResponse(
        id=uuid.uuid4(),
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        role=user_in.role,
        created_at=datetime.now(timezone.utc).replace(tzinfo=None),
        updated_at=datetime.now(timezone.utc).replace(tzinfo=None)
    )
    return {"user": mock_user, "token": "mock.jwt.token"}

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin):
    mock_user = UserResponse(
        id=uuid.uuid4(),
        email=credentials.email,
        first_name="Mock",
        last_name="User",
        role=UserRole.user,
        created_at=datetime.now(timezone.utc).replace(tzinfo=None),
        updated_at=datetime.now(timezone.utc).replace(tzinfo=None)
    )
    return {"user": mock_user, "token": "mock.jwt.token"}

@router.get("/me", response_model=UserResponse)
def get_current_user():
    return UserResponse(
        id=uuid.uuid4(),
        email="user@example.com",
        first_name="Mock",
        last_name="User",
        role=UserRole.user,
        created_at=datetime.now(timezone.utc).replace(tzinfo=None),
        updated_at=datetime.now(timezone.utc).replace(tzinfo=None)
    )
