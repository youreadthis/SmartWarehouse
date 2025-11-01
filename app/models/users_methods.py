from app.models.users import Users
from app.models import db_session
from sqlalchemy import select


Session = db_session.get_session()


async def check_useres(email) -> Users | None:
    async with Session() as session:
        query = select(Users).where(Users.email == email)
        result = await session.execute(query)
        result = result.scalar_one_or_none()
        return result

async def login(email, password) -> Users | None:
    async with Session() as session:
        query = select(Users).where(Users.email == email and Users.password_hash == password)
        result = await session.execute(query)
        result = result.scalar_one_or_none()
        return result