"""
PlantVerse AI - Admin Audit Logging & System Telemetry Router
Provides endpoints for Super Admins to view security logs, user IP history, authentication events, and system alerts.
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from auth import require_roles
from database import AUDIT_LOGS

router = APIRouter(prefix="/api/admin", tags=["Security & Audit Logs"])

@router.get("/audit-logs")
def list_audit_logs(
    user: dict = Depends(require_roles(["SUPER_ADMIN"])),
    limit: int = Query(20, ge=1, le=100),
    actionFilter: Optional[str] = Query(None)
):
    logs = AUDIT_LOGS
    if actionFilter:
        af = actionFilter.lower()
        logs = [l for l in logs if af in l.get("action", "").lower() or af in l.get("actor", "").lower()]

    return {
        "status": "success",
        "totalCount": len(logs),
        "returnedCount": min(limit, len(logs)),
        "data": logs[:limit]
    }
