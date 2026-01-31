from models.robots import Robots
from models.inventory_history import InventoryHistory
from models.base import Base
import time
import datetime
import random
from datetime import datetime
import os
from pytz import timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан в окружении")

engine = create_engine(DATABASE_URL, pool_size=5, max_overflow=10)
SessionLocal = scoped_session(sessionmaker(bind=engine))
Base.metadata.create_all(bind=engine)

class RobotEmulator:
    def __init__(self, robot_id):
        self.robot_id = robot_id
        self.battery = random.randint(25, 100)
        self.current_zone = random.choice("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
        self.current_row = random.randint(1, 50)
        self.current_shelf = 1
        self.status = "active"

        # Список тестовых товаров
        self.products = [
            {"id": "TEL-4567", "name": "Роутер RT-AC68U"},
            {"id": "TEL-8901", "name": "Модем DSL-2640U"},
            {"id": "TEL-2345", "name": "Коммутатор SG-108"},
            {"id": "TEL-6789", "name": "IP-телефон T46S"},
            {"id": "TEL-3456", "name": "Кабель UTP Cat6"}
        ]

    def generate_scan_data(self):
        """Генерация данных сканирования"""

        scanned_products = random.sample(self.products, k=random.randint(1, 3))
        scan_results = []
        for product in scanned_products:
            quantity = random.randint(5, 100)
            status = "OK" if quantity > 20 else ("LOW_STOCK" if quantity > 10 else "CRITICAL")
            scan_results.append({
                "product_id": product["id"],
                "product_name": product["name"],
                "quantity": quantity,
                "status": status
            })
        return scan_results

    def move_to_next_location(self):
        """Перемещение робота к следующей локации"""

        self.current_shelf += 1
        if self.current_shelf > 10:
            self.current_shelf = 1
            self.current_row += 1
        if self.current_row > 50:
            self.current_row = 1
            # Переход к следующей зоне
            self.current_zone = chr(ord(self.current_zone) + 1)
            if ord(self.current_zone) > ord('E'):
                self.current_zone = 'A'
        # Расход батареи
        self.battery -= random.uniform(0.1, 0.5)
        if self.battery < 20:
            self.status = "discharged"
            self.send_data()
            time.sleep(120)
            self.battery = 100 
            self.status = "active"

    def send_data(self):
        data = {
            "status": self.status,
            "robot_id": self.robot_id,
            "zone": self.current_zone,
            "row": self.current_row,
            "shelf": self.current_shelf,
            "battery_level": round(self.battery, 1),
            "next_checkpoint": f"{self.current_zone}-{self.current_row + 1}-{self.current_shelf}",
            "scan_results": self.generate_scan_data()
        }
        session = SessionLocal()
        try:
            robots_db_record = Robots(
                id=data["robot_id"],
                status=data["status"],
                current_zone=data["zone"],
                current_row=data["row"],
                current_shelf=data["shelf"],
                battery_level=data["battery_level"],
                last_update=datetime.now()
            )
            session.merge(robots_db_record)

            for scan_result in data["scan_results"]:
                inventory_db_record = InventoryHistory(
                    robot_id = data["robot_id"],
                    product_id = scan_result["product_id"],
                    product_name = scan_result["product_name"],
                    quantity = scan_result["quantity"],
                    zone = data["zone"],
                    row_number = data["row"],
                    shelf_number = data["shelf"],
                    status = scan_result["status"],
                    scanned_at = datetime.now(tz=timezone("Europe/Moscow"))
                )

                session.merge(inventory_db_record)
            session.commit()

            print(f"[R-{self.robot_id}] Данные сохранены в БД", flush=True)
        except Exception as e:
            print(f"[R-{self.robot_id}] Ошибка БД: {e}", flush=True)
            session.rollback()
        finally:
            if session:
                session.close()

    def run(self):
        """Основной цикл работы робота"""
        try:
                self.send_data()
                self.move_to_next_location()
        except Exception as e:
                print(f"[R-{self.robot_id}] Неожиданная ошибка в run(): {e}", flush=True)
                time.sleep(10)