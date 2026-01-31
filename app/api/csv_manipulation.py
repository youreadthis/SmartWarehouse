from fastapi import APIRouter, HTTPException, Request
from parsing.csv_parser import CSVParser
from models.inventory_history import InventoryHistory
import csv
import os
from datetime import datetime
from pytz import timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
from models.base import Base

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан в окружении")

engine = create_engine(DATABASE_URL, pool_size=5, max_overflow=10)
SessionLocal = scoped_session(sessionmaker(bind=engine))
session = SessionLocal()
Base.metadata.create_all(bind=engine)

router = APIRouter()
NAME_FOR_OUTPUT_CSV_FILE = "./output.csv"
REQUIRED_COLUMNS = ["product_id", "product_name", "quantity", "zone", "date"]

class CSVManipulator(CSVParser):
    def __init__(self, file_path):
        super().__init__(file_path)
        self.progress = 0

    async def check_if_file_valid(self, req: Request):
        self.file_as_bytes = await req.body()
        self.write_bytes_to_file()

        column_names = self.get_column_names(encoding="utf-8", delimiter=";")
        for column in REQUIRED_COLUMNS:
            if column not in column_names:
                raise HTTPException(400, f"В файле нет обязательного столбца: {column}")

        return {"message": "Файл успешно прочитан", "preview": self.get_preview()}

    def write_bytes_to_file(self):
        csv_string = self.file_as_bytes.decode("utf-8")
        lines = csv_string.splitlines()
        with open(NAME_FOR_OUTPUT_CSV_FILE, "w", encoding="utf-8") as file:
            writer = csv.writer(file, delimiter=";")
            for line in lines:
                writer.writerow(line.split(";"))

    def get_preview(self):
        with open(NAME_FOR_OUTPUT_CSV_FILE, encoding="utf-8") as file:
            array_of_strings = []

            reader = csv.reader(file, delimiter=";")
            for row in reader:
                array_of_strings.append(row)
                if len(array_of_strings) == 5:
                    break

            return array_of_strings
        
    def write_from_csv_to_db(self):
        data_for_db = self.parse(delimiter=";")
        number_of_rows = self.count_rows(delimiter=";")

        for i in range(len(data_for_db)):
            scan_data = data_for_db[i]
            scan_status = "OK" if int(scan_data["quantity"]) > 20 else "LOW_STOCK" if int(scan_data["quantity"]) > 10 else "CRITICAL"
            scan_date = datetime.strptime(scan_data["date"], "%d.%m.%Y").astimezone(timezone("Europe/Moscow"))

            record = InventoryHistory(
                robot_id=scan_data.get("robot_id", "Неизвестно"),
                product_name =scan_data.get("product_name"),
                product_id=scan_data.get("product_id"),
                quantity=scan_data.get("quantity"),
                zone=scan_data.get("zone"),
                row_number=scan_data.get("row", 1),
                shelf_number=scan_data.get("shelf_number", 1),
                status=scan_status,
                scanned_at=scan_date
            )

            session.merge(record)
            self.progress = ((i + 1) / number_of_rows) * 100
        session.commit()


manipulator = CSVManipulator(NAME_FOR_OUTPUT_CSV_FILE)

@router.post("/csv-validate")
async def validate(req: Request):
   result = await manipulator.check_if_file_valid(req)
   return result

@router.post("/csv-write")
def write_to_db():
    try:
        manipulator.write_from_csv_to_db()
        return {"message": "Данные успешно сохранены в БД"}

    except Exception as err:
        print(err)
        raise HTTPException(500, "Возникла ошибка при сохранении данных в БД")

@router.get("/csv-progress")
def get_progress():
    return {"progress": manipulator.progress}