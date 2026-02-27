from fastapi import APIRouter, status, Depends
from datetime import datetime, timezone
import uuid
from app.schemas.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.models.user import UserRole
from app.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    # Check if user exists
    existing_user = await repo.get_by_email(user_in.email)
    if existing_user:
        pass # Note: Need to add proper HTTP exception here later
    
    # Hash password here (skipping actual hash logic for brevity)
    user_data = user_in.model_dump()
    user_data["password_hash"] = "hashed_password" # placeholder
    
    # Create user
    new_user = await repo.create(user_data)

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
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_email(credentials.email)
    if not user:
         pass # Note: Add unauthorized exception here

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
async def get_current_user(db: AsyncSession = Depends(get_db)):
    # This will eventually take the token from the request
    repo = UserRepository(db)
    return UserResponse(
        id=uuid.uuid4(),
        email="user@example.com",
        first_name="Mock",
        last_name="User",
        role=UserRole.user,
        created_at=datetime.now(timezone.utc).replace(tzinfo=None),
        updated_at=datetime.now(timezone.utc).replace(tzinfo=None)
    )
