from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.pool import NullPool

from SmartWarehouse.configFile.DataBaseconfig import USERBD, PASSWORDBD

# Строка подключения к базе данных
# Здесь нужно заменить данные user, password, dbname на свои
DATABASE_URL = f"postgresql+psycopg://{USERBD}:{PASSWORDBD}@host:port/dbname[?key=value&key=value...]"

# Создаем асинхронный движок
engine = create_async_engine(DATABASE_URL)

# Создаем сессию
async_session =  async_sessionmaker(engine, expire_on_commit=False)
session = async_session()

# Функция для получения сессии
async def get_db():
    db = async_session()
    try:
        yield db
    finally:
        await db.close()