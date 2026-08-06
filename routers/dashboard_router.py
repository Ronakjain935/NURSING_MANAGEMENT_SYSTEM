"""
PlantVerse AI - Role-Based Dashboards Router
Provides tailored KPI telemetry, operational queues, and management panels for:
1. Customer
2. Nursery Staff
3. Nursery Owner
4. Plant Expert
5. Delivery Partner
6. Super Admin
"""

from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user, require_roles
from database import PLANTS, ORDERS, EXPERTS, AUDIT_LOGS, USERS_DB, CROPS_AGRONOMY_DATA

router = APIRouter(prefix="/api/dashboard", tags=["Role-Based Dashboards"])

@router.get("/customer")
def get_customer_dashboard(user: dict = Depends(get_current_user)):
    user_email = user.get("email", "")
    customer_orders = [o for o in ORDERS if o.get("email") == user_email or not user_email]
    
    return {
        "status": "success",
        "role": "CUSTOMER",
        "user": user,
        "kpis": {
            "plantsTracked": 4,
            "healthScoreAvg": 94,
            "nextWateringDue": "Tomorrow, 8:00 AM",
            "rewardPoints": 450,
            "activeOrdersCount": len(customer_orders)
        },
        "careReminders": [
            {"plant": "Monstera Deliciosa", "action": "Watering 250ml", "due": "Today", "urgent": True},
            {"plant": "Feng Shui Money Plant", "action": "Foliage Misting", "due": "Tomorrow", "urgent": False},
            {"plant": "Areca Palm", "action": "Soil Aeration Check", "due": "In 3 Days", "urgent": False}
        ],
        "myGarden": [
            {"id": "g1", "name": "Monstera Deliciosa", "location": "Living Room Window", "health": 96, "lastWatered": "2 days ago", "status": "Thriving"},
            {"id": "g2", "name": "Snake Plant (Sansevieria)", "location": "Bedroom Desk", "health": 98, "lastWatered": "5 days ago", "status": "Optimal"},
            {"id": "g3", "name": "Peace Lily Sensation", "location": "Balcony Shade", "health": 88, "lastWatered": "Yesterday", "status": "Needs misting"}
        ],
        "recentOrders": customer_orders[:3]
    }

@router.get("/staff")
def get_staff_dashboard(user: dict = Depends(require_roles(["NURSERY_STAFF", "OWNER", "SUPER_ADMIN"]))):
    dispatch_queue = [
        {"orderId": "PV-2026-9041", "customer": "Ananya Sharma", "items": "1x Monstera Deliciosa, 1x Organic Bio-Shield", "status": "Packing Required", "priority": "High"},
        {"orderId": "PV-2026-9042", "customer": "Rohan Mehta", "items": "2x Feng Shui Money Plant", "status": "Ready for Dispatch", "priority": "Normal"},
        {"orderId": "PV-2026-9043", "customer": "Priya Patel", "items": "1x Areca Palm, 1x Neem Fertilizer", "status": "Quality Inspected", "priority": "Normal"}
    ]
    
    return {
        "status": "success",
        "role": "NURSERY_STAFF",
        "user": user,
        "kpis": {
            "pendingFulfillment": 14,
            "inspectedBatches": 28,
            "lowStockAlerts": 3,
            "dispatchedToday": 42
        },
        "dispatchQueue": dispatch_queue,
        "dailyCareSectionTasks": [
            {"section": "Greenhouse A (Indoor Tropicals)", "task": "Morning Automated Drip Mist", "status": "Completed", "staffAssigned": "Staff Member"},
            {"section": "Outdoor Yard B (Fruit Saplings)", "task": "Inspect Leaf Undersides for Rust", "status": "Pending", "staffAssigned": "Staff Member"},
            {"section": "Shade Netting C (Bonsai Section)", "task": "Apply Seaweed Kelp Liquid Booster", "status": "In Progress", "staffAssigned": "Staff Member"}
        ]
    }

@router.get("/owner")
def get_owner_dashboard(user: dict = Depends(require_roles(["NURSERY_OWNER", "OWNER", "SUPER_ADMIN"]))):
    return {
        "status": "success",
        "role": "NURSERY_OWNER",
        "user": user,
        "kpis": {
            "monthlyRevenueINR": 485000.00,
            "grossMarginPct": 42.5,
            "totalOrdersProcessed": 1420,
            "inventoryValuationINR": 1850000.00,
            "wastageIndexPct": 1.8
        },
        "demandForecastHeatmap": [
            {"month": "Aug 2026", "demandIndex": 88, "highDemandCategory": "Indoor Air Purifiers", "predictedSalesINR": 520000},
            {"month": "Sep 2026", "demandIndex": 94, "highDemandCategory": "Monsoon Bloom Flowers", "predictedSalesINR": 580000},
            {"month": "Oct 2026 (Diwali Surge)", "demandIndex": 125, "highDemandCategory": "Gift Plants & Pots", "predictedSalesINR": 820000}
        ],
        "inventoryAlerts": [
            {"plant": "Areca Palm (5-ft)", "currentStock": 8, "reorderPoint": 20, "recommendation": "Restock 50 units immediately to capture Sept demand surge."},
            {"plant": "Neem Bio-Shield Oil", "currentStock": 4, "reorderPoint": 15, "recommendation": "High monsoon pest demand detected."}
        ]
    }

@router.get("/expert")
def get_expert_dashboard(user: dict = Depends(require_roles(["PLANT_EXPERT", "SUPER_ADMIN", "OWNER"]))):
    return {
        "status": "success",
        "role": "PLANT_EXPERT",
        "user": user,
        "kpis": {
            "todayConsultations": 5,
            "totalDiagnosesReviewed": 340,
            "expertRating": 4.96,
            "pendingPrescriptions": 2
        },
        "appointmentQueue": [
            {"id": "apt-1", "patientName": "Vikram Malhotra", "timeSlot": "10:30 AM", "topic": "Severe Monstera Leaf Yellowing & Root Rot Query", "status": "Confirmed"},
            {"id": "apt-2", "patientName": "Sneha Reddy", "timeSlot": "02:00 PM", "topic": "Balcony Citrus Tree Caterpillars & Neem Dosage", "status": "Upcoming"},
            {"id": "apt-3", "patientName": "Amitabh Roy", "timeSlot": "04:30 PM", "topic": "Commercial Mango Orchard N-P-K Soil Protocol", "status": "Upcoming"}
        ],
        "recentPathologyScans": [
            {"patient": "Vikram M.", "plant": "Monstera", "aiDetection": "Nitrogen Deficiency & Overwatering", "confidence": 96.5, "status": "Pending Prescription Review"}
        ]
    }

@router.get("/delivery")
def get_delivery_dashboard(user: dict = Depends(require_roles(["DELIVERY_PARTNER", "SUPER_ADMIN", "OWNER"]))):
    return {
        "status": "success",
        "role": "DELIVERY_PARTNER",
        "user": user,
        "kpis": {
            "assignedDeliveries": 8,
            "completedToday": 6,
            "onTimeRatePct": 98.2,
            "todayEarningsINR": 1450.00
        },
        "currentRoute": [
            {
                "stopNumber": 1,
                "orderId": "PV-2026-9041",
                "customerName": "Ananya Sharma",
                "address": "Flat 402, Green Glen Layout, Bellandur, Bengaluru",
                "phone": "+91 98765 43210",
                "otpCodeRequired": "5812",
                "status": "Out for Delivery",
                "items": "1x Monstera, 1x Bio-Shield"
            },
            {
                "stopNumber": 2,
                "orderId": "PV-2026-9042",
                "customerName": "Rohan Mehta",
                "address": "Villa 12, Sobha Chrysanthemum, Hebbal, Bengaluru",
                "phone": "+91 91234 56789",
                "otpCodeRequired": "4490",
                "status": "Pending Pickup",
                "items": "2x Feng Shui Money Plant"
            }
        ]
    }

@router.get("/super-admin")
def get_super_admin_dashboard(user: dict = Depends(require_roles(["SUPER_ADMIN"]))):
    return {
        "status": "success",
        "role": "SUPER_ADMIN",
        "user": user,
        "systemKpis": {
            "totalUsers": len(USERS_DB) + 12450,
            "totalNurseriesOnboarded": 48,
            "totalGMVINR": 14285000.00,
            "aiScansPerformed": 89400,
            "cvModelAccuracyPct": 98.4,
            "ragResponseLatencyMs": 320
        },
        "roleBreakdown": {
            "CUSTOMERS": 11800,
            "NURSERY_STAFF": 240,
            "NURSERY_OWNERS": 48,
            "PLANT_EXPERTS": 35,
            "DELIVERY_PARTNERS": 120,
            "SUPER_ADMINS": 2
        },
        "systemHealth": {
            "databaseStatus": "HEALTHY (PostgreSQL / SQLite Production Replica)",
            "cvModelStatus": "PyTorch ResNet-50 Active (CUDA Accelerated)",
            "ragLlmStatus": "Groq LLaMA-3.3 70B Active (100% SLA)",
            "smsGateways": "Fast2SMS & Twilio Active",
            "razorpayStatus": "Live Gateway Verified"
        },
        "recentAuditLogs": AUDIT_LOGS[:5]
    }
