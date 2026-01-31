from fastapi import APIRouter
from sqlalchemy import select, cast, Date
from datetime import datetime
from models.db_session import get_session
from models.inventory_history import InventoryHistory

router = APIRouter()

@router.get("/statistics")
async def get_statistics(dateFrom: str, dateTo: str):
    date_from = datetime.fromisoformat(dateFrom).date()
    date_to = datetime.fromisoformat(dateTo).date()
    print(date_from, date_to)

    async_session = get_session()

    async with async_session() as session:
        scans = await session.execute(select(InventoryHistory).where(date_from <= cast(InventoryHistory.scanned_at, Date), cast(InventoryHistory.scanned_at, Date) <= date_to))
        scans = scans.all()
        return {"scans": len(scans)}