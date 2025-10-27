from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import main_router
from configFile import url

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[f"{url}"],
)

app.include_router(router=main_router)

