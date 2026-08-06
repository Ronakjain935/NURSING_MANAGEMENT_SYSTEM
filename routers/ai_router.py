"""
PlantVerse AI - Artificial Intelligence Router
Exposes endpoints for Computer Vision Leaf Pathology, RAG Botanical LLM Assistant,
Agronomy Crop Recommendation, Smart Penman-Monteith Watering, Indian Plant Fit Engine, and Demand/Churn Analytics.
"""

from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Query, HTTPException, Depends
from models import CropRecommendRequest, GrowthPredictRequest, WateringPredictRequest, ChatRequest, IndianFitQuizRequest
from ai_engine import ai_engine
from ml_models import ml_engine

router = APIRouter(prefix="/api/ai", tags=["Artificial Intelligence & ML"])

@router.post("/indian-fit-quiz")
def evaluate_indian_plant_fit(req: IndianFitQuizRequest):
    """
    Ranks plants against specific Indian environmental constraints:
    City climate, Balcony sunlight, AQI levels, Tap water TDS, space size, and budget.
    """
    city_lower = req.city.lower()
    results = ai_engine.recommend_plants({
        "sunlight": req.balconySun,
        "experience": req.experience,
        "petFriendly": req.petFriendly,
        "maxBudget": req.maxBudget / 80.0 # Convert INR to USD reference
    })

    # Calibrate recommendations for Indian conditions
    customized = []
    for plant in results:
        p = plant.copy()
        
        # Indian AQI bonus
        if req.aqiFocus and p.get("airPurificationScore", 0) > 90:
            p["matchScore"] = min(99.8, p["matchScore"] + 8.0)
            p["indianFitReason"] = f"Top NASA AQI Purifier — Excellent for {req.city}'s urban air quality!"
        elif "delhi" in city_lower or "jaipur" in city_lower:
            if "heat" in p.get("description", "").lower() or "succulent" in p.get("category", "") or "snake" in p.get("name", "").lower():
                p["matchScore"] = min(99.8, p["matchScore"] + 6.0)
                p["indianFitReason"] = f"Heatwave Tough (up to 45°C) — Fits dry summer climate of {req.city}!"
            else:
                p["indianFitReason"] = f"Requires shade cloth during extreme summer heat (40°C+) in {req.city}."
        elif "mumbai" in city_lower or "kochi" in city_lower or "chennai" in city_lower:
            p["indianFitReason"] = f"Monsoon & Coastal Humidity Friendly — Ideal for high humidity in {req.city}."
        else:
            p["indianFitReason"] = f"Perfect fit for {req.spaceSize} with {req.balconySun}."

        # Hard water TDS tip
        if req.hardWaterTds and req.hardWaterTds > 300:
            p["hardWaterAdvice"] = "Use RO water or let tap water sit overnight to dissipate chlorine."

        customized.append(p)

    customized.sort(key=lambda x: x["matchScore"], reverse=True)
    return {
        "status": "success",
        "cityEvaluated": req.city,
        "balconySun": req.balconySun,
        "spaceSize": req.spaceSize,
        "count": len(customized),
        "data": customized
    }

@router.post("/diagnose")
async def diagnose_leaf_pathology(file: UploadFile = File(None), base64Image: Optional[str] = Form(None), filename: Optional[str] = Query("")):
    import base64
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
    return result

@router.post("/crop-recommend")
def recommend_crops(payload: CropRecommendRequest):
    results = ml_engine.recommend_crops(payload.dict())
    return {"status": "success", "count": len(results), "data": results}

@router.post("/chat")
def rag_care_chatbot(payload: ChatRequest):
    data = ai_engine.rag_care_chat(query=payload.query)
    return {
        "status": "success",
        "reply": data["response"],
        "source": data.get("ragSource", "PlantVerse Groq AI (LLaMA-3.3 70B)"),
        "suggestedFollowUps": data.get("suggestedFollowUps", []),
        "data": data
    }

@router.post("/growth")
def predict_growth(payload: GrowthPredictRequest):
    data = ai_engine.predict_growth(
        plant_id=payload.plantId,
        soil=payload.soil,
        sunlight_hours=payload.sunlightHours,
        water_days=payload.waterDays
    )
    return {"status": "success", "data": data}

@router.post("/watering")
def predict_watering(payload: WateringPredictRequest):
    data = ai_engine.predict_smart_watering(
        plant_id=payload.plantId,
        temp_c=payload.tempC,
        humidity_pct=payload.humidityPct,
        city=payload.city
    )
    return {"status": "success", "data": data}

@router.get("/forecast")
def get_demand_forecast():
    data = ml_engine.predict_future_demand()
    return {"status": "success", "data": data}

@router.get("/churn-predict")
def predict_customer_churn():
    return {
        "status": "success",
        "churnRiskSegments": [
            {"segment": "Inactive Gardeners (No log in 30+ days)", "riskPct": 42.0, "recommendedAction": "Send WhatsApp care reminder & 15% plant fertilizer discount coupon."},
            {"segment": "First-Time Plant Buyers", "riskPct": 18.5, "recommendedAction": "Send automatic Day-7 care check-in survey."},
            {"segment": "Master Gardeners & Commercial Buyers", "riskPct": 4.2, "recommendedAction": "Invite to VIP Plant Expert Masterclass."}
        ]
    }
