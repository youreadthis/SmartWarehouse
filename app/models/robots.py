import sqlalchemy
from app.models.db_session import *
from sqlalchemy.orm import declarative_base
import datetime


Session = get_session()
Base = declarative_base()


class Robots(Base):
    __tablename__ = 'users'

    id = sqlalchemy.Column(sqlalchemy.String, primary_key=True, autoincrement=True)
    status = sqlalchemy.Column(sqlalchemy.String, nullable=False, default='active')
    battery_level = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    last_update = sqlalchemy.Column(sqlalchemy.DateTime, default=lambda: datetime.timezone, nullable=False)
    current_zone = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    current_row = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    current_shelf = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)