from models.users import Users
from models.base import Base
from sqlalchemy import select
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
import os

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL не задан в окружении")

engine = create_engine(DATABASE_URL, pool_size=5, max_overflow=10)
SessionLocal = scoped_session(sessionmaker(bind=engine))
Base.metadata.create_all(bind=engine)

USERS = [
    Users(
        id=1,
        name="Иван",
        email="ivan@example.com",
        password_hash="12345cat",
        role="Оператор"
    ),
    Users(
        id=2,
        name="Элла",
        email="ellak@example.com",
        password_hash="maTHISgooD",
        role="Просматривающий"
    ),
    Users(
        id=3,
        name="Владимир",
        email="vladimir@example.com",
        password_hash="122333444455555",
        role="Администратор"
    )
]

def login(email, password) -> Users | None:
    session = SessionLocal()
    for user in USERS:
        session.merge(user)

    session.commit()
            
    query = select(Users).where(Users.email == email, Users.password_hash == password)
    result = session.execute(query)
    result = result.one_or_none()

    return result