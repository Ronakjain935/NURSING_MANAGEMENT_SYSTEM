"""
PlantVerse AI - Nursery Service Plans & Owner Query Router
Handles Plan Listings, Plan Order Submissions, User Queries, and Owner Status Management.
"""

import random
from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Query
from database import NURSERY_PLANS, PLAN_ORDERS
from models import PlanModel, PlanOrderCreate, PlanOrderStatusUpdate

router = APIRouter(prefix="/api/plan-orders", tags=["Nursery Plans & Owner Queries"])

@router.get("/plans")
def list_nursery_plans():
    return {"status": "success", "count": len(NURSERY_PLANS), "data": NURSERY_PLANS}

@router.post("/")
def create_plan_order(payload: PlanOrderCreate):
    order_id = f"PLAN-ORD-{random.randint(1000, 9999)}"
    now_str = datetime.now().strftime("%Y-%m-%d %I:%M %p")
    
    new_plan_order = {
        "id": order_id,
        "planId": payload.planId,
        "planTitle": payload.planTitle,
        "price": payload.price,
        "billingCycle": payload.billingCycle,
        "customerName": payload.customerName,
        "customerEmail": payload.customerEmail,
        "customerPhone": payload.customerPhone or "N/A",
        "address": payload.address or "N/A",
        "queryNotes": payload.queryNotes,
        "status": "Pending",
        "createdAt": now_str,
        "ownerNote": "Query received by Nursery Owner. Awaiting review & approval."
    }
    
    PLAN_ORDERS.insert(0, new_plan_order)
    return {
        "status": "success",
        "message": f"Plan Order '{payload.planTitle}' & query submitted to Nursery Owner!",
        "order": new_plan_order
    }

@router.get("/")
def get_all_plan_orders(email: Optional[str] = Query(None)):
    if email:
        filtered = [o for o in PLAN_ORDERS if o["customerEmail"].lower() == email.lower()]
        return {"status": "success", "count": len(filtered), "data": filtered}
    return {"status": "success", "count": len(PLAN_ORDERS), "data": PLAN_ORDERS}

@router.get("/my-orders")
def get_my_plan_orders(email: str = Query(...)):
    user_orders = [o for o in PLAN_ORDERS if o["customerEmail"].lower() == email.lower()]
    return {"status": "success", "count": len(user_orders), "data": user_orders}

@router.put("/{order_id}/status")
def update_plan_order_status(order_id: str, payload: PlanOrderStatusUpdate):
    order = next((o for o in PLAN_ORDERS if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Plan order / query not found")
    
    order["status"] = payload.status
    if payload.ownerNote:
        order["ownerNote"] = payload.ownerNote
        
    return {
        "status": "success",
        "message": f"Order {order_id} status updated to '{payload.status}'",
        "order": order
    }

@router.delete("/{order_id}")
def delete_plan_order(order_id: str):
    global PLAN_ORDERS
    order_idx = next((i for i, o in enumerate(PLAN_ORDERS) if o["id"] == order_id), None)
    if order_idx is None:
        raise HTTPException(status_code=404, detail="Plan order not found")
    
    removed = PLAN_ORDERS.pop(order_idx)
    return {"status": "success", "message": f"Plan order {order_id} deleted", "order": removed}
