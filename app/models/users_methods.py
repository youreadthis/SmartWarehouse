from app.models.users import Users
from app.models import db_session
from sqlalchemy import select


Session = db_session.get_session()


async def check_useres(email):
    async with Session() as session:
        query = select(Users).where(Users.email == email)
        result = await session.execute(query)
        result = result.scalar_one_or_none()
        return result