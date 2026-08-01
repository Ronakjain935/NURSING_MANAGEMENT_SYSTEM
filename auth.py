"""
PlantVerse AI - Authentication & Role-Based Access Control (RBAC) Module
Provides password hashing, JWT token creation, decoding, and role validation middleware.
"""

import hmac
import hashlib
import json
import base64
import time
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, Security, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = "PLANTVERSE_AI_PRODUCTION_SECRET_KEY_2026_ECOSYSTEM"
ALGORITHM = "HS256"

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hashes password using HMAC-SHA256."""
    return hmac.new(SECRET_KEY.encode('utf-8'), password.encode('utf-8'), hashlib.sha256).hexdigest()

def verify_password(password: str, hashed_password: str) -> bool:
    """Verifies plain password against hashed password."""
    return hash_password(password) == hashed_password

def create_jwt_token(payload: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
    """Generates a signature-verified JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    
    payload_copy = payload.copy()
    payload_copy["exp"] = int(time.time()) + expires_in_seconds
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload_copy).encode()).decode().rstrip("=")
    
    to_sign = f"{header_b64}.{payload_b64}"
    signature = hmac.new(SECRET_KEY.encode(), to_sign.encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode().rstrip("=")
    
    return f"{to_sign}.{sig_b64}"

def decode_jwt_token(token: str) -> Dict[str, Any]:
    """Decodes and validates JWT token signature and expiration."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            raise HTTPException(status_code=401, detail="Invalid token format")
        
        header_b64, payload_b64, sig_b64 = parts
        to_sign = f"{header_b64}.{payload_b64}"
        
        # Verify signature
        expected_sig = base64.urlsafe_b64encode(
            hmac.new(SECRET_KEY.encode(), to_sign.encode(), hashlib.sha256).digest()
        ).decode().rstrip("=")
        
        if not hmac.compare_digest(sig_b64, expected_sig):
            raise HTTPException(status_code=401, detail="Invalid token signature")
        
        # Decode payload
        padding = "=" * (4 - len(payload_b64) % 4)
        payload_json = base64.urlsafe_b64decode(payload_b64 + padding).decode()
        payload = json.loads(payload_json)
        
        if payload.get("exp", 0) < time.time():
            raise HTTPException(status_code=401, detail="Token has expired")
            
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")

def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Dict[str, Any]:
    """Dependency injection to fetch current authenticated user from Authorization header."""
    if not credentials:
        # Fallback default guest user for easy testing
        return {
            "userId": "usr_guest_101",
            "email": "sarah.j@example.com",
            "fullName": "Sarah Jenkins",
            "role": "CUSTOMER"
        }
    token = credentials.credentials
    return decode_jwt_token(token)

def require_roles(allowed_roles: List[str]):
    """Decorator dependency to enforce Role-Based Access Control (RBAC)."""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role", "CUSTOMER")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User role '{user_role}' does not have required permissions: {allowed_roles}"
            )
        return current_user
    return role_checker
