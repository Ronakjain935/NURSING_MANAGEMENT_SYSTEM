"""
PlantVerse AI - Plants & Inventory Router
Handles Plant Catalog, Category Listings, Search, Filtering, and Nursery Stock Inventory.
"""

from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query
from database import CATEGORIES, PLANTS

router = APIRouter(prefix="/api/plants", tags=["Marketplace & Plants"])

@router.get("/categories")
def list_categories():
    return {"status": "success", "data": CATEGORIES}

@router.get("/")
def list_plants(
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sunlight: Optional[str] = Query(None),
    petFriendly: Optional[bool] = Query(None),
    maxPrice: Optional[float] = Query(None)
):
    filtered = PLANTS.copy()

    if category and category != "all":
        filtered = [p for p in filtered if p["category"] == category]

    if search:
        s = search.lower().strip()
        filtered = [
            p for p in filtered 
            if s in p["name"].lower() 
            or s in p["scientificName"].lower() 
            or s in p["category"].lower() 
            or s in p.get("soilType", "").lower()
            or s in p.get("description", "").lower()
            or s in p.get("careDifficulty", "").lower()
            or s in p.get("aiHealthTip", "").lower()
            or any(s in t.lower() for t in p.get("tags", []))
        ]

    if sunlight and sunlight != "all":
        filtered = [p for p in filtered if sunlight.lower() in p["sunlight"].lower()]

    if petFriendly is True:
        filtered = [p for p in filtered if p["isPetFriendly"] is True]

    if maxPrice and maxPrice > 0:
        filtered = [p for p in filtered if p["price"] <= maxPrice]

    return {"status": "success", "count": len(filtered), "data": filtered}

@router.get("/{plant_id}")
def get_plant_by_id(plant_id: str):
    plant = next((p for p in PLANTS if p["id"] == plant_id), None)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant species not found")
    
    related = [p for p in PLANTS if p["category"] == plant["category"] and p["id"] != plant_id][:3]
    return {"status": "success", "data": plant, "relatedPlants": related}

@router.get("/inventory/stock")
def get_nursery_inventory():
    inventory_items = []
    for idx, p in enumerate(PLANTS):
        inventory_items.append({
            "plantId": p["id"],
            "plantName": p["name"],
            "category": p["category"],
            "batchCode": f"BATCH-2026-00{idx+1}",
            "stockCount": p["stockQuantity"],
            "reorderLevel": 15,
            "warehouseRack": f"RACK-{chr(65+idx)}-04",
            "lastInspected": "2026-07-28"
        })
    return {"status": "success", "count": len(inventory_items), "data": inventory_items}
