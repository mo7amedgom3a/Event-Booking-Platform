from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.utils.jwt import decode_access_token
import logging

logger = logging.getLogger(__name__)

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We always set request.state.user. It will be None if unauthorized.
        request.state.user = None
        
        auth_header = request.headers.get("Authorization")
        token = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        elif "access_token" in request.cookies:
            token = request.cookies.get("access_token")

        if token:
            try:
                payload = decode_access_token(token)
                user_id = payload.get("sub")
                role = payload.get("role")
                if user_id:
                    request.state.user = {
                        "id": user_id,
                        "role": role
                    }
            except Exception as e:
                # Token is invalid or expired. We don't raise 401 here 
                # so that public endpoints can still function. 
                # Protected endpoints will check `request.state.user` and raise 401.
                logger.warning(f"Invalid JWT token: {e}")
                pass
                
        return await call_next(request)
