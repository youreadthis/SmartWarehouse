from fastapi import APIRouter

from SmartWarehouse.app.api.user import router as user_router

main_router = APIRouter()

main_router.include_router(user_router, prefix="/user", tags=["User"])


 