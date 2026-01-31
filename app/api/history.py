from fastapi import APIRouter
from models.db_session import get_session
from sqlalchemy import text
from pytz import timezone
from json import dumps
from datetime import datetime

router = APIRouter()

@router.get("/history")
async def send_scans(start=0, end=100, zones=None, nameOrSKU=None, statuses=None, dateFrom=0, dateTo=0):
    other_params = {

    }

    if zones: 
        other_params["zones"] = zones.split(",")

    if nameOrSKU:
        other_params["nameOrSKU"] = nameOrSKU

    if statuses:
        other_params["statuses"] = statuses.split(",")
    
    if dateFrom:
        other_params["dateFrom"] = datetime.fromisoformat(dateFrom).astimezone(timezone("Europe/Moscow"))
    
    if dateTo:
        other_params["dateTo"] = datetime.fromisoformat(dateTo).astimezone(timezone("Europe/Moscow"))

    scans = await get_scans(start, end, **other_params)
    
    return dumps(scans)

async def get_scans(start, end, **other_params):
    async_session = get_session()
    async with async_session() as session:
        where_part_of_query = " WHERE " if other_params else ""

        zones_part_of_query = ""
        name_or_sku_part_of_query = ""
        statuses_part_of_query = ""

        if "zones" in other_params:
            zones_part_of_query = "(zone = " + " OR zone = ".join([f"'{item}'" for item in other_params.get("zones", [])]) + ") " + "AND " if ("nameOrSKU" in other_params or "statuses" in other_params) else ""
        if "nameOrSKU" in other_params:
            name_or_sku_part_of_query = "(product_name LIKE '%" + other_params.get("nameOrSKU", "")  + "%' OR product_id LIKE '%"  + other_params.get("nameOrSKU", "") + "%')"  + "AND " if "statuses" in other_params else ""
        if "statuses" in other_params:
            statuses_part_of_query = "(" + "status = " + " OR status = ".join([f"\'{item.upper().replace("-", "_")}\'" for item in other_params.get("statuses", [])])  + ")" 

        query = "SELECT id, robot_id, product_name, product_id, zone, quantity, status, scanned_at FROM inventory_history" +  where_part_of_query + zones_part_of_query + name_or_sku_part_of_query + statuses_part_of_query + " ORDER BY id DESC"

        scans = await session.execute(text(query))
                                            
        scans = scans.all()
        scans_list = []
        i = 0

        while len(scans_list) < int(end) - int(start) or int(end) <= int(start):
            if i < len(scans):
                scan = scans[i]
                scanned_at = scan[7].astimezone(timezone("Europe/Moscow"))

                if not "dateTo" in other_params or not "dateFrom" in other_params or other_params["dateFrom"].date() <= scanned_at.date() <= other_params["dateTo"].date():
                    scan_dict = {
                        "id": scan[0],
                        "robot_id": scan[1],
                        "product_name": scan[2],
                        "product_id": scan[3],
                        "zone": scan[4],
                        "quantity": scan[5],
                        "status": scan[6],
                        "scanned_at": scanned_at.strftime("%d.%m.%Y, %H:%M:%S")
                    }

                    scans_list.append(scan_dict)
                i += 1
            else:
                break

        return scans_list
        