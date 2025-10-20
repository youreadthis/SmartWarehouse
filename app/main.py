from fastapi import FastAPI

from SmartWarehouse.app.api import main_router


app = FastAPI()

app.include_router(router=main_router)

