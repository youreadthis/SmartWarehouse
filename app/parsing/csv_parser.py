import csv
import os
from typing import List, Dict, Any
from pathlib import Path


class CSVParser:
    """
    Класс для парсинга CSV-файлов.
    Позволяет читать данные и возвращать их в виде списка словарей
    для дальнейшей загрузки в БД.
    """

    def __init__(self, file_path: str):
        """
        Инициализация парсера с путём к CSV-файлу.
        :param file_path: путь к CSV-файлу
        """
        self.file_path = file_path
        if not os.path.exists(file_path):
            file = Path(file_path)
            file.touch(exist_ok=True)

    def parse(self, encoding: str = 'utf-8', delimiter: str = ',') -> List[Dict[str, Any]]:
        """
        Парсит CSV-файл и возвращает список словарей.
        Каждый словарь — одна строка данных с ключами-колонками.
        :param encoding: кодировка файла (по умолчанию utf-8)
        :param delimiter: разделитель (по умолчанию запятая)
        :return: список словарей с данными
        """
        data = []
        try:
            with open(self.file_path, mode='r', encoding=encoding, newline='') as file:
                reader = csv.DictReader(file, delimiter=delimiter)
                for row in reader:
                    data.append(row)
        except Exception as e:
            raise RuntimeError(f"Ошибка при чтении CSV: {e}")
        return data

    def get_column_names(self, encoding: str = 'utf-8', delimiter: str = ',') -> List[str]:
        """
        Возвращает список имён колонок из заголовка CSV.
        :param encoding: кодировка файла
        :param delimiter: разделитель
        :return: список названий колонок
        """
        try:
            with open(self.file_path, mode='r', encoding=encoding, newline='') as file:
                reader = csv.reader(file, delimiter=delimiter)
                header = next(reader)  # первая строка — заголовки
                return header
        except Exception as e:
            raise RuntimeError(f"Ошибка при получении колонок: {e}")

    def count_rows(self, encoding: str = 'utf-8', delimiter: str = ',') -> int:
        """
        Считает количество строк в CSV (без заголовка).
        :param encoding: кодировка
        :param delimiter: разделитель
        :return: число строк
        """
        try:
            with open(self.file_path, mode='r', encoding=encoding, newline='') as file:
                reader = csv.reader(file, delimiter=delimiter)
                next(reader)  # пропускаем заголовок
                return sum(1 for _ in reader)
        except Exception as e:
            raise RuntimeError(f"Ошибка при подсчёте строк: {e}")

