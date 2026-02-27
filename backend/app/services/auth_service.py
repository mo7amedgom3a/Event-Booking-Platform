from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserLogin, UserUpdate
from app.utils.jwt import get_password_hash, verify_password, create_access_token
from app.models.user import User

class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)

    async def register_user(self, user_in: UserCreate) -> dict:
        existing_user = await self.repo.get_by_email(user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered."
            )
        
        user_data = user_in.model_dump()
        user_data["password_hash"] = get_password_hash(user_data.pop("password"))
        
        new_user = await self.repo.create(user_data)
        
        # Generate token
        token_data = {"sub": str(new_user.id), "role": new_user.role}
        token_str = create_access_token(token_data)
        
        return {
            "user": new_user,
            "token": {"access_token": token_str, "token_type": "bearer"}
        }

    async def authenticate_user(self, credentials: UserLogin) -> dict:
        user = await self.repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
        token_data = {"sub": str(user.id), "role": user.role}
        token_str = create_access_token(token_data)
        
        return {
            "user": user,
            "token": {"access_token": token_str, "token_type": "bearer"}
        }

    async def get_user_by_id(self, user_id: str) -> User:
        user = await self.repo.get(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def get_all_users(self, skip: int = 0, limit: int = 100) -> list[User]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def update_user_profile(self, user_id: str, user_in: UserUpdate) -> User:
        user = await self.get_user_by_id(user_id)
        update_data = user_in.model_dump(exclude_unset=True)
        return await self.repo.update(user, update_data)
