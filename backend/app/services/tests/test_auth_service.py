import pytest
from app.utils.jwt import create_access_token, decode_access_token

def test_jwt():
    token = create_access_token({"sub": "123", "role": "organizer"})
    payload = decode_access_token(token)
    assert payload["sub"] == "123"
