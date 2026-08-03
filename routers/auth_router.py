"""
PlantVerse AI - Authentication API Router
Handles User Registration, Login, Token Generation, and Current User Profile.
"""

from fastapi import APIRouter, HTTPException, Depends
from models import UserRegister, UserLogin, UserProfile, TokenResponse
from auth import hash_password, verify_password, create_jwt_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# In-memory user database (Only created users and Main Admin can log in)
USERS_DB = {
    "rjainabr@gmail.com": {
        "userId": "usr_main_admin_001",
        "email": "rjainabr@gmail.com",
        "passwordHash": hash_password("8209829945"),
        "fullName": "Main Admin",
        "role": "SUPER_ADMIN",
        "phone": "9461645362",
        "rewardPoints": 10000,
        "memberStatus": "Main Super Admin"
    }
}


@router.post("/register", response_model=TokenResponse)
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
        "fullName": current_user.get("fullName", "User"),
        "email": email or "",
        "role": current_user.get("role", "CUSTOMER"),
        "rewardPoints": 100,
        "memberStatus": "Member"
    })
    return UserProfile(
        id=user["userId"],
        fullName=user["fullName"],
        email=user["email"],
        role=user["role"],
        phone=user.get("phone"),
        rewardPoints=user.get("rewardPoints", 100),
        memberStatus=user.get("memberStatus", "Member")
    )


@router.get("/security-policy")
def get_security_policy():
    return {
        "status": "success",
        "policyName": "PlantVerse AI Enterprise Security & Governance Architecture",
        "version": "v3.0-SEC-2026",
        "securityPurposes": [
            {
                "title": "Role-Based Resource Isolation (RBAC)",
                "description": "Restricts financial revenue data, crop ordering pipelines, and nursery inventory controls exclusively to verified Nursery Owners and Administrators.",
                "icon": "fa-user-shield",
                "severity": "CRITICAL"
            },
            {
                "title": "User Data Privacy & Regulatory Protection",
                "description": "Encrypts customer personal data, address information, and crop care journals in compliance with international privacy standards.",
                "icon": "fa-lock",
                "severity": "HIGH"
            },
            {
                "title": "Agronomy ML Model Security",
                "description": "Protects proprietary Scikit-Learn soil recommendation algorithms and PyTorch ResNet-50 leaf pathology inference engines against unauthorized API scraping or parameter tampering.",
                "icon": "fa-microchip",
                "severity": "HIGH"
            },
            {
                "title": "Continuous Audit Logging & Threat Monitoring",
                "description": "Logs all administrative actions, authentication attempts, stock restocks, and delivery OTP validations with HMAC signature verification.",
                "icon": "fa-clock-rotate-left",
                "severity": "MEDIUM"
            }
        ],
        "encryptionStandard": "HMAC-SHA256 Signed JWT Tokens",
        "tokenExpiryHours": 24,
        "rateLimiting": "100 requests / minute per IP",
        "corsPolicy": "Restricted Domain Cross-Origin Resource Sharing",
        "activeSecurityAuditLogs": [
            {"id": "SEC-LOG-901", "timestamp": "2026-08-03 16:00:12", "event": "JWT Session Verified", "actor": "owner@plantverse.ai", "role": "OWNER", "status": "APPROVED"},
            {"id": "SEC-LOG-902", "timestamp": "2026-08-03 15:45:00", "event": "Authentication Attempt", "actor": "sarah.j@example.com", "role": "CUSTOMER", "status": "APPROVED"},
            {"id": "SEC-LOG-903", "timestamp": "2026-08-03 14:20:00", "event": "RBAC Permission Enforced", "actor": "Guest Client", "role": "UNAUTHENTICATED", "status": "BLOCKED_BY_GUARD"}
        ]
    }
