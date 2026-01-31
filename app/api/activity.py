from fastapi import APIRouter
from sqlalchemy import text
from models.db_session import get_session
from os import getenv
from datetime import datetime

router = APIRouter()

@router.get("/activity")
async def send_activity_data():
    activity_data = await get_activity_data()
    return activity_data


async def get_activity_data():
    async_session = get_session()
    async with async_session() as session:
        scans = await session.execute(text("SELECT id, robot_id, scanned_at FROM inventory_history ORDER BY id DESC"))

        scans = scans.all()
        activity_data = []
        for _ in range(int(getenv("ROBOTS_COUNT", 5))):
            activity_arr = [0 for _ in range(60)]
            activity_data.append(activity_arr)

        for scan in scans:
            scan_date = scan[2]
            robot_id = scan[1]

            diff = datetime.now().timestamp() - scan_date.timestamp()

            if diff < 3600:
                minute = diff // 60
                activity_data[int(robot_id) - 1][int(minute) - 1] += 1

        return activity_data