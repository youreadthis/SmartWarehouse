import sqlalchemy
from app.models.db_session import *
from sqlalchemy.orm import declarative_base


Session = get_session()
Base = declarative_base()


class Users(Base):
    __tablename__ = 'users'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    name = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    email = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    password_hash = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    role = sqlalchemy.Column(sqlalchemy.String, nullable=False)