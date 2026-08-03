"""
PlantVerse AI - Database Schema & ORM Data Models
Defines complete data structures for Users, Plants, Categories, Inventory, Orders,
Crop Recommendation Requests, Disease Reports, Digital Plant Journals, and Consultations.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- User & Auth Schemas ---
class UserRegister(BaseModel):
    fullName: str
    email: str
    password: str
    phone: Optional[str] = None
    role: Optional[str] = "CUSTOMER"

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfile(BaseModel):
    id: str
    fullName: str
    email: str
    role: str
    phone: Optional[str] = None
    rewardPoints: int = 0
    memberStatus: str = "Gardener"

class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str = "Bearer"
    user: UserProfile

# --- Category & Plant Schemas ---
class CategoryModel(BaseModel):
    id: str
    name: str
    icon: str
    count: int
    desc: str

class PlantModel(BaseModel):
    id: str
    name: str
    scientificName: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    rating: float = 4.8
    reviewsCount: int = 0
    inStock: bool = True
    stockQuantity: int = 50
    image: str
    images: List[str] = []
    isPetFriendly: bool = False
    careDifficulty: str = "Easy"
    sunlight: str = "Indirect Bright Light"
    waterFrequency: str = "Every 7 Days"
    humidity: str = "50% - 70%"
    temperature: str = "18°C - 30°C"
    soilType: str = "Well-draining potting mix"
    airPurificationScore: int = 90
    growthSpeed: str = "Medium"
    maxHeight: str = "1.5 meters"
    repottingSchedule: str = "Every 18 months"
    description: str
    aiHealthTip: str
    tags: List[str] = []

# --- AI Crop Recommendation Schemas ---
class CropRecommendRequest(BaseModel):
    nitrogen: float = 90.0
    phosphorus: float = 42.0
    potassium: float = 43.0
    ph: float = 6.5
    temperature: float = 25.0
    humidity: float = 80.0
    rainfall: float = 200.0
    soilType: Optional[str] = "Loamy"

class RecommendRequest(BaseModel):
    sunlight: Optional[str] = "Indirect Bright Light"
    experience: Optional[str] = "Beginner"
    petFriendly: Optional[bool] = False
    maxBudget: Optional[float] = 100.0
    location: Optional[str] = "Indoor Balcony"

class GrowthPredictRequest(BaseModel):
    plantId: str
    soil: Optional[str] = "Organic potting mix"
    sunlightHours: Optional[int] = 6
    waterDays: Optional[int] = 7

class WateringPredictRequest(BaseModel):
    plantId: str
    city: Optional[str] = "San Francisco"
    tempC: Optional[float] = 24.0
    humidityPct: Optional[float] = 65.0

class ChatRequest(BaseModel):
    query: str

class CheckoutRequest(BaseModel):
    customerName: str
    email: str
    address: str
    items: List[Dict[str, Any]]
    paymentMethod: str
    couponCode: Optional[str] = None

class JournalEntryRequest(BaseModel):
    plantName: str
    species: str
    location: str
    notes: str

class BookingRequest(BaseModel):
    expertId: str
    date: str
    timeSlot: str

class OrderStatusUpdateRequest(BaseModel):
    status: str

# --- Nursery Service Plans & Queries Schemas ---
class PlanModel(BaseModel):
    id: str
    title: str
    price: float
    billingCycle: str = "Monthly"
    description: str
    features: List[str] = []
    badge: Optional[str] = None
    isPopular: bool = False

class PlanOrderCreate(BaseModel):
    planId: str
    planTitle: str
    price: float
    billingCycle: str = "Monthly"
    customerName: str
    customerEmail: str
    customerPhone: Optional[str] = None
    address: Optional[str] = None
    queryNotes: str

class PlanOrderStatusUpdate(BaseModel):
    status: str
    ownerNote: Optional[str] = None


