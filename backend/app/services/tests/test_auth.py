import pytest
from app.services.auth_service import AuthService
from app.schemas.user import UserCreate

@pytest.mark.asyncio
async def test_register_user(db_session):
    service = AuthService(db_session)
    user_in = UserCreate(
        email="test_new@example.com", 
        password="secure", 
        first_name="Test", 
        last_name="New",
        role="organizer"
    )
    result = await service.register_user(user_in)
    assert result["user"].email == "test_new@example.com"
    assert "token" in result
