import sqlalchemy
from models.db_session import *
from models.base import Base
from datetime import datetime
from pytz import timezone


Session = get_session()

class InventoryHistory(Base):
    __tablename__ = "inventory_history"

    id = sqlalchemy.Column(sqlalchemy.Integer, primary_key=1, autoincrement=True)
    robot_id = sqlalchemy.Column(sqlalchemy.String)
    product_name = sqlalchemy.Column(sqlalchemy.String)
    product_id = sqlalchemy.Column(sqlalchemy.String)
    quantity = sqlalchemy.Column(sqlalchemy.Integer, nullable=0)
    zone = sqlalchemy.Column(sqlalchemy.String, nullable=0)
    row_number = sqlalchemy.Column(sqlalchemy.Integer)
    shelf_number = sqlalchemy.Column(sqlalchemy.Integer)
    status = sqlalchemy.Column(sqlalchemy.String)
    scanned_at = sqlalchemy.Column(sqlalchemy.TIMESTAMP(timezone=True))
    created_at = sqlalchemy.Column(sqlalchemy.TIMESTAMP, default=datetime.now(tz=timezone("Europe/Moscow")))