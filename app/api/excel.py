from fastapi import APIRouter, Request
from fastapi.responses import FileResponse
from pandas import DataFrame
from json import loads
from datetime import datetime
from pytz import timezone

router = APIRouter()
FILENAME = f"scans-{datetime.now().astimezone(timezone("Europe/Moscow")).strftime("%d%m%Y%H%M%S")}.xlsx"

@router.post("/excel")
async def send_excel_file(req: Request):
    scans = await req.body()
    scans = loads(scans)

    scans_data_frame = DataFrame(scans)
    scans_data_frame.to_excel(FILENAME, sheet_name="Сканирования", index=0, header=["id", "ID робота", "Название продукта", "ID продукта", "Зона склада", "Количество", "Статус", "Дата проверки"])

    headers = {'Content-Disposition': f'attachment; filename="{FILENAME}"'}
    return FileResponse(FILENAME, headers=headers, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
