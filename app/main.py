from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, WebSocket, WebSocketException
from datetime import datetime
from sqlalchemy import text
from time import sleep
from pytz import timezone
from datetime import datetime
from json import dumps
from os import getenv

from models.db_session import get_session
from models.robotemulator import RobotEmulator
from api import main_router


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods = ["*"],
    allow_credentials=True,
    allow_headers = ["*"]
)

app.include_router(router=main_router)
number_of_robots = int(getenv("ROBOTS_COUNT", 5))
robots = [RobotEmulator(i + 1) for i in range(number_of_robots)]

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            for robot in robots:
                robot.run()

            data = {
                "statuses": await get_robots_statuses(),
                "checks_today": await get_number_of_checks_today(),
                "running_out": await get_goods_that_are_running_out(),
                "average_battery_level": await get_average_battery_level(),
                "robots_data_for_map": await get_robots_data_for_map(),
                "latest_scans": await get_latest_scans(),
                "zones_statuses": await get_zones_statuses(),
                
            }
            await websocket.send_json(dumps(data))
            sleep(5)
    except WebSocketException as e:
        print(f"WebSocket closed with code: {e.code}")
    except Exception as e:
        print(f"Ошибка: {e}", flush=True)
    finally:
        await websocket.close()


async def get_robots_statuses():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT id, status FROM robots"))
        query_result = query_result.all()
        robots_statuses = {"total": len(query_result), "active": len([robot for robot in query_result if robot[1] == "active"])}

        return robots_statuses
    

async def get_robots_data_for_map():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT id, battery_level, last_update, current_zone, current_row FROM robots"))
        query_result = query_result.all()
        data_for_map = [
            {
                "id": robot[0],
                "battery_level": robot[1],
                "last_update": robot[2].astimezone(timezone("Europe/Moscow")).strftime("%d.%m.%Y, %H:%M:%S"),
                "current_location": f"{robot[3]}-{robot[4]}"
            } 
            for robot in query_result
        ]

        return data_for_map

    
async def get_number_of_checks_today():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT CAST(scanned_at AS DATE) as scanned_at_date FROM inventory_history"))
        query_result = query_result.all()
        number_of_today_checks = len([scan_date for scan_date in query_result if scan_date[0] == datetime.now().date()])

        return number_of_today_checks

async def get_goods_that_are_running_out():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT status, zone, row_number, shelf_number FROM inventory_history"))
        query_result = query_result.all()
        unique_rows = []
        frequency_dict = {}

        # Просматриваем в обратном порядке (с самых свежих записей)

        # Заполняем частотный словарь и попутно просматриваем его
        for i in range(len(query_result) - 1, -1, -1):
            row = query_result[i]
            location = f"{row[1]}-{row[2]}-{row[3]}"
            if location not in frequency_dict:
                frequency_dict[location] = 1
                unique_rows.append(row)
        
        number_of_critical_goods = len([product for product in unique_rows if product[0] == "CRITICAL"])
        
        return number_of_critical_goods

async def get_average_battery_level():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT battery_level FROM robots"))
        query_result = query_result.all()
        battery_levels = [robot[0] for robot in query_result]

        if len(battery_levels):
            average_battery_level = sum(battery_levels) / len(battery_levels)
            return round(average_battery_level)
        return None
    
async def get_zones_statuses():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT zone, row_number, status, scanned_at from inventory_history"))
        query_result = query_result.all()

        frequencies_dict = {}
        zones_stasuses = {}
        
        for i in range(len(query_result) - 1, -1, -1):
            scan_result = query_result[i]

            location = f"{scan_result[0]}-{scan_result[1]}"
            if location not in frequencies_dict:
                frequencies_dict[location] = 1
                diff = datetime.now(tz=timezone("Europe/Moscow")).timestamp() - scan_result[3].timestamp()

                status = "critical" if scan_result[2] == "CRITICAL" else ("checked_recently" if diff < 3600 else "need_to_check")
                zones_stasuses[location] = status

        return zones_stasuses            
    

async def get_latest_scans():
    async_session = get_session()
    async with async_session() as session:
        query_result = await session.execute(text("SELECT scanned_at, robot_id, zone, product_name, product_id, quantity, id FROM inventory_history  ORDER BY id DESC LIMIT 20"))
        query_result = list(query_result.all())
        data_to_send = []
        for i in range(len(query_result)):
            scan_obj = query_result[i]
            scan_dict = {
                "scanned_at": scan_obj[0].astimezone(timezone("Europe/Moscow")).strftime("%H:%M:%S"),
                "robot_id": scan_obj[1],
                "zone": scan_obj[2],
                "product_name": scan_obj[3],
                "product_id": scan_obj[4],
                "quantity": scan_obj[5]
            }

            data_to_send.append(scan_dict)

        return data_to_send