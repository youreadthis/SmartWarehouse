from .history import get_scans
from fastapi import APIRouter
from fastapi.responses import FileResponse
from reportlab.platypus import Table, SimpleDocTemplate, TableStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from datetime import datetime
from pytz import timezone

FILENAME = f"scans-{datetime.now().astimezone(timezone("Europe/Moscow")).strftime("%d%m%Y%H%M%S")}.pdf"
pdfmetrics.registerFont(TTFont("Roboto", "Roboto/Roboto-VariableFont_wdth,wght.ttf"))

def generate_pdf(scans):
    headers = [["Дата и время проверки", "ID робота", "Зона склада", "Артикул товара", "Название товара", "Количество", "Статус"]]
    scans_data = []

    for scan in scans:
        row = []
        row.append(scan["scanned_at"])
        row.append(scan["robot_id"])
        row.append(scan["zone"])
        row.append(scan["product_id"])
        row.append(scan["product_name"])
        row.append(scan["quantity"])
        row.append("Критические остатки" if scan["status"] == "CRITICAL" else "Осталось мало" if scan["status"] == "LOW_STOCK" else scan["status"])

        scans_data.append(row)

    doc = SimpleDocTemplate(filename=FILENAME)
    table = Table(headers + scans_data)
    table.setStyle(TableStyle([["FONT", [0, 0], [-1, -1], "Roboto", 8], ["GRID", [0, 0], [-1, -1], 1, "dimgray"]]))
    doc.build([table])


router = APIRouter()

@router.post("/pdf")
async def send_link_to_pdf(zones=None, nameOrSKU=None, statuses=None, dateFrom=0, dateTo=0):
    other_params = {}

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

    scans = await get_scans(0, 0, **other_params)
    generate_pdf(scans)

    headers = {'Content-Disposition': f'attachment; filename="{FILENAME}"'}
    return FileResponse(FILENAME, headers=headers, media_type="application/pdf")