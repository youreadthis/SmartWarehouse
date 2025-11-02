from app.models.robots import Robots
import json
import time
import random
import requests
from datetime import datetime
import os
import psycopg2
from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
Base = declarative_base()

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан в окружении")

engine = create_engine(DATABASE_URL, pool_size=5, max_overflow=10)
SessionLocal = scoped_session(sessionmaker(bind=engine))

class RobotEmulator:
    def __init__(self, robot_id, api_url):

        if len(robot_id) > 50:
            raise ValueError(f"robot_id слишком длинный: {robot_id}")
        self.robot_id = robot_id
        self.api_url = api_url
        self.battery = 100
        self.current_zone = 'A'
        self.current_row = 1
        self.current_shelf = 1

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
        if self.current_row > 20:
            self.current_row = 1
            # Переход к следующей зоне
            self.current_zone = chr(ord(self.current_zone) + 1)
            if ord(self.current_zone) > ord('E'):
                self.current_zone = 'A'
        # Расход батареи
        self.battery -= random.uniform(0.1, 0.5)
        if self.battery < 20:
            self.battery = 100  # Симуляция зарядки

    def send_data(self):
        data = {
            "robot_id": self.robot_id,
            "zone": self.current_zone,
            "row": self.current_row,
            "shelf": self.current_shelf,
            "battery_level": round(self.battery, 1),
            "next_checkpoint": f"{self.current_zone}-{self.current_row + 1}-{self.current_shelf}",
            "scan_results": self.generate_scan_data()
        }
        if not self.api_url.startswith(('http://', 'https://')):
            print(f"[{self.robot_id}] Некорректный API URL: {self.api_url}")
            return
        try:
            response = requests.post(self.api_url, json=data, timeout=10)
            if response.status_code == 200:
                print(f"[{self.robot_id}] Данные отправлены на API (HTTP {response.status_code})")
            else:
                print(f"[{self.robot_id}] Ошибка API: HTTP {response.status_code}, ответ: {response.text}")
        except requests.exceptions.RequestException as e:
            print(f"[{self.robot_id}] Исключение при отправке на API: {e}")
        session = SessionLocal()
        try:
            db_record = Robots(
                id=data["robot_id"],
                zone=data["zone"],
                row=data["row"],
                shelf=data["shelf"],
                battery_level=data["battery_level"],
                next_checkpoint=data["next_checkpoint"],
                scan_results=data["scan_results"]
            )
            session.add(db_record)
            session.commit()
            print(f"[{self.robot_id}] Данные сохранены в БД")
        except Exception as e:
            print(f"[{self.robot_id}] Ошибка БД: {e}")
            session.rollback()
        finally:
            if session:
                session.close()

    def run(self):
        """Основной цикл работы робота"""

        while True:
            try:
                self.send_data()
                self.move_to_next_location()
                update_interval = int(os.getenv('UPDATE_INTERVAL', '10'))
                time.sleep(update_interval)
            except Exception as e:
                print(f"[{self.robot_id}] Неожиданная ошибка в run(): {e}")
                time.sleep(10)

if __name__ == "__main__":
    try:
        Base.metadata.create_all(engine)
        print("Таблицы созданы")
    except Exception as e:
        print(f"Ошибка создания таблиц: {e}")
        raise
    api_url = os.getenv('API_URL', 'http://localhost:3000')
    if not api_url.startswith(('http://', 'https://')):
        raise ValueError(f"Некорректный API_URL: {api_url}")
    robots_count = int(os.getenv('ROBOTS_COUNT', 5))
    # Запуск эмуляторов роботов
    import threading

    for i in range(1, robots_count + 1):
        robot = RobotEmulator(f"RB-{i:03d}", api_url)
        thread = threading.Thread(target=robot.run)
        thread.daemon = True
        thread.start()
    # Держим главный поток активным
    while True:
        time.sleep(60)
