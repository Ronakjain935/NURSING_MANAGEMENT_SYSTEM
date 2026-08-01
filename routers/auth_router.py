"""
PlantVerse AI - Authentication API Router
Handles User Registration, Login, Token Generation, and Current User Profile.
"""

from fastapi import APIRouter, HTTPException, Depends
from models import UserRegister, UserLogin, UserProfile, TokenResponse
from auth import hash_password, verify_password, create_jwt_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory user database
USERS_DB = {
    "sarah.j@example.com": {
        "userId": "usr_sarah_101",
        "email": "sarah.j@example.com",
        "passwordHash": hash_password("gardener2026"),
        "fullName": "Sarah Jenkins",
        "role": "CUSTOMER",
        "phone": "+1 (555) 382-9102",
        "rewardPoints": 480,
        "memberStatus": "Gold Gardener"
    },
    "admin@plantverse.ai": {
        "userId": "usr_admin_001",
        "email": "admin@plantverse.ai",
        "passwordHash": hash_password("adminSecret2026"),
        "fullName": "Super Administrator",
        "role": "SUPER_ADMIN",
        "phone": "+1 (555) 999-0000",
        "rewardPoints": 9999,
        "memberStatus": "Super Admin"
    }
}

@app_router_register := router.post("/register", response_model=TokenResponse)
def register_user(payload: UserRegister):
    if payload.email in USERS_DB:
        raise HTTPException(status_code=400, detail="User email already registered")
    
    import random
    user_id = f"usr_{random.randint(1000, 9999)}"
    password_h = hash_password(payload.password)
    
    user_data = {
        "userId": user_id,
        "email": payload.email,
        "passwordHash": password_h,
        "fullName": payload.fullName,
        "role": payload.role or "CUSTOMER",
        "phone": payload.phone,
        "rewardPoints": 100,
        "memberStatus": "Green Member"
    }
    USERS_DB[payload.email] = user_data
    
    token = create_jwt_token({
        "userId": user_id,
        "email": payload.email,
        "fullName": payload.fullName,
        "role": payload.role or "CUSTOMER"
    })
    
    profile = UserProfile(
        id=user_id,
        fullName=payload.fullName,
        email=payload.email,
        role=payload.role or "CUSTOMER",
        phone=payload.phone,
        rewardPoints=100,
        memberStatus="Green Member"
    )
    
    return TokenResponse(accessToken=token, user=profile)

@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLogin):
    user = USERS_DB.get(payload.email)
    if not user or not verify_password(payload.password, user["passwordHash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password credentials")
    
    token = create_jwt_token({
        "userId": user["userId"],
        "email": user["email"],
        "fullName": user["fullName"],
        "role": user["role"]
    })
    
    profile = UserProfile(
        id=user["userId"],
        fullName=user["fullName"],
        email=user["email"],
        role=user["role"],
        phone=user.get("phone"),
        rewardPoints=user.get("rewardPoints", 0),
        memberStatus=user.get("memberStatus", "Gardener")
    )
    
    return TokenResponse(accessToken=token, user=profile)

@router.get("/me", response_model=UserProfile)
def get_me(current_user: dict = Depends(get_current_user)):
    email = current_user.get("email")
    user = USERS_DB.get(email, {
        "userId": current_user.get("userId", "usr_guest"),
        "fullName": current_user.get("fullName", "Guest Gardener"),
        "email": email or "guest@plantverse.ai",
        "role": current_user.get("role", "CUSTOMER"),
        "rewardPoints": 250,
        "memberStatus": "Gardener"
    })
    return UserProfile(
        id=user["userId"],
        fullName=user["fullName"],
        email=user["email"],
        role=user["role"],
        phone=user.get("phone"),
        rewardPoints=user.get("rewardPoints", 250),
        memberStatus=user.get("memberStatus", "Gardener")
    )
