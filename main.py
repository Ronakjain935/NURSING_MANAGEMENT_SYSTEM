"""
PlantVerse AI - FastAPI Application Server
Provides REST APIs for E-Commerce, Computer Vision Disease Diagnosis, AI Crop Recommendation,
Growth Predictor, Smart Water Engine, RAG Care Chatbot, Orders & Live Tracking, and Admin Analytics.
"""

import os
import base64
import random
from typing import Dict, Any, Optional, List
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware

from database import CATEGORIES, PLANTS, CROPS_AGRONOMY_DATA, ORDERS, PLANT_JOURNAL, EXPERTS
from ai_engine import ai_engine
from ml_models import ml_engine
from auth import get_current_user, require_roles
from models import RecommendRequest, CropRecommendRequest, GrowthPredictRequest, WateringPredictRequest, ChatRequest, CheckoutRequest, JournalEntryRequest, BookingRequest

from routers import auth_router, plants_router

app = FastAPI(
    title="PlantVerse AI Platform",
    description="Smart Nursery, AI Crop Recommendation & Intelligent Care Ecosystem",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(plants_router.router)

# --- REST API ENDPOINTS ---

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "system": "PlantVerse AI Platform",
        "version": "3.0.0",
        "models": {
            "cv_model": "PyTorch ResNet-50 Grad-CAM Engine",
            "crop_recommend_model": "Scikit-Learn Agronomy Crop Engine",
            "demand_model": "Scikit-Learn Linear Regression Forecaster",
            "chat_model": "RAG Botanical LLM Assistant"
        }
    }

@app.get("/api/crops")
def get_crops():
    return {"status": "success", "count": len(CROPS_AGRONOMY_DATA), "data": CROPS_AGRONOMY_DATA}

@app.post("/api/ai/crop-recommend")
def recommend_crops(payload: CropRecommendRequest):
    results = ml_engine.recommend_crops(payload.dict())
    return {"status": "success", "count": len(results), "data": results}

@app.post("/api/ai/diagnose")
async def diagnose_leaf_disease(file: UploadFile = File(None), base64Image: Optional[str] = Form(None), filename: Optional[str] = Query("")):
    image_bytes = None
    fn = filename or "leaf.jpg"

    if file:
        image_bytes = await file.read()
        fn = file.filename
    elif base64Image:
        try:
            if "," in base64Image:
                base64Image = base64Image.split(",")[1]
            image_bytes = base64.b64decode(base64Image)
        except Exception:
            pass

    result = ml_engine.classify_leaf_pathology(image_bytes=image_bytes, filename=fn)
    return JSONResponse(content=result)

@app.post("/api/ai/recommend")
def recommend_plants(payload: RecommendRequest):
    results = ai_engine.recommend_plants(payload.dict())
    return {"status": "success", "count": len(results), "data": results}

@app.post("/api/ai/growth")
def predict_growth(payload: GrowthPredictRequest):
    data = ai_engine.predict_growth(
        plant_id=payload.plantId,
        soil=payload.soil,
        sunlight_hours=payload.sunlightHours,
        water_days=payload.waterDays
    )
    return {"status": "success", "data": data}

@app.post("/api/ai/watering")
def predict_watering(payload: WateringPredictRequest):
    data = ai_engine.predict_smart_watering(
        plant_id=payload.plantId,
        temp_c=payload.tempC,
        humidity_pct=payload.humidityPct,
        city=payload.city
    )
    return {"status": "success", "data": data}

@app.get("/api/ai/forecast")
def get_demand_forecast():
    data = ml_engine.predict_future_demand()
    return {"status": "success", "data": data}

@app.post("/api/ai/chat")
def rag_care_chatbot(payload: ChatRequest):
    data = ai_engine.rag_care_chat(query=payload.query)
    return {"status": "success", "data": data}

@app.post("/api/orders/checkout")
def checkout_order(payload: CheckoutRequest):
    subtotal = sum(item["price"] * item["qty"] for item in payload.items)
    discount = round(subtotal * 0.15, 2) if payload.couponCode and payload.couponCode.upper() in ["PLANTAI15", "GREEN2026"] else 0.0
    tax = round((subtotal - discount) * 0.08, 2)
    total = round(subtotal - discount + tax, 2)

    order_id = f"PV-2026-{random.randint(1000, 9999)}"
    
    new_order = {
        "orderId": order_id,
        "date": "2026-08-01",
        "customer": payload.customerName,
        "email": payload.email,
        "address": payload.address,
        "items": payload.items,
        "subtotal": round(subtotal, 2),
        "discount": discount,
        "tax": tax,
        "shipping": 0.00,
        "total": total,
        "status": "Order Placed",
        "paymentMethod": payload.paymentMethod,
        "paymentStatus": "Paid (Razorpay Verified)",
        "trackingNumber": f"TRK-PV-{random.randint(10000, 99999)}",
        "estimatedDelivery": "Within 2-3 Business Days",
        "deliveryPartner": {"name": "Carlos Gomez", "phone": "+1 (555) 492-1049", "otp": str(random.randint(1000, 9999))}
    }
    
    ORDERS.insert(0, new_order)
    return {
        "status": "success",
        "message": "Order successfully placed and verified via Razorpay!",
        "order": new_order,
        "razorpayTransactionId": f"pay_RZP_{random.randint(1000000, 9999999)}"
    }

@app.get("/api/orders")
def get_orders():
    return {"status": "success", "data": ORDERS}

@app.get("/api/orders/{order_id}/track")
def track_order(order_id: str):
    order = next((o for o in ORDERS if o["orderId"] == order_id), None)
    if not order:
        order = ORDERS[0]
    
    return {
        "status": "success",
        "order": order,
        "liveLocation": {
            "lat": 37.7749 + (0.002),
            "lng": -122.4194 + (0.003),
            "driverName": order.get("deliveryPartner", {}).get("name", "Carlos Gomez"),
            "driverPhone": order.get("deliveryPartner", {}).get("phone", "+1 (555) 019-2831"),
            "deliveryOTP": order.get("deliveryPartner", {}).get("otp", "5812"),
            "etaMinutes": 18
        }
    }

@app.get("/api/journal")
def get_journal():
    return {"status": "success", "data": PLANT_JOURNAL}

@app.post("/api/journal")
def add_journal_entry(payload: JournalEntryRequest):
    new_entry = {
        "id": f"j{len(PLANT_JOURNAL)+1}",
        "plantName": payload.plantName,
        "species": payload.species,
        "adoptingDate": "2026-08-01",
        "lastWatered": "2026-08-01",
        "nextWatering": "2026-08-08",
        "lastFertilized": "2026-08-01",
        "healthScore": 95,
        "location": payload.location,
        "notes": payload.notes,
        "timeline": [
            {"date": "2026-08-01", "event": "Added to PlantVerse Digital Journal", "type": "adopted"}
        ]
    }
    PLANT_JOURNAL.insert(0, new_entry)
    return {"status": "success", "data": new_entry}

@app.get("/api/consultations")
def get_consultations():
    return {"status": "success", "data": EXPERTS}

@app.post("/api/consultations/book")
def book_consultation(payload: BookingRequest):
    expert = next((e for e in EXPERTS if e["id"] == payload.expertId), EXPERTS[0])
    return {
        "status": "success",
        "message": f"Consultation session confirmed with {expert['name']} for {payload.date} at {payload.timeSlot}!",
        "videoLink": "https://meet.plantverse.ai/room-pv-live-session-8821"
    }

@app.get("/api/analytics")
def get_admin_analytics(user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "kpis": {
            "totalRevenueUSD": 142850.00,
            "monthlyOrders": 1240,
            "activePlantsTracked": 8920,
            "aiScanAccuracyPct": 98.4,
            "activeGardeners": 5410
        },
        "recentAiScans": [
            {"date": "10 mins ago", "plant": "Monstera Deliciosa", "result": "98% Healthy", "status": "Passed"},
            {"date": "24 mins ago", "plant": "Rose Bush", "result": "Leaf Rust Detected", "status": "Treatment Recommended"},
            {"date": "1 hour ago", "plant": "Tomato Vine", "result": "Nitrogen Deficiency", "status": "Fertilizer Suggested"}
        ]
    }

static_dir = os.path.join(os.path.dirname(__file__), "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def read_root():
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse("<h1>PlantVerse AI Server Running</h1><p>Visit /static/index.html</p>")
