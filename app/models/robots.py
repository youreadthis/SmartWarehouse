import sqlalchemy
from models.db_session import *
from models.base import Base
import datetime


Session = get_session()


class Robots(Base):
    __tablename__ = 'robots'

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=True, autoincrement=True)
    status = sqlalchemy.Column(sqlalchemy.String, nullable=False, default='active')
    battery_level = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    last_update = sqlalchemy.Column(sqlalchemy.DateTime, default=datetime.datetime.now(), nullable=False)
    current_zone = sqlalchemy.Column(sqlalchemy.String, nullable=False)
    current_row = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)
    current_shelf = sqlalchemy.Column(sqlalchemy.Integer, nullable=False)