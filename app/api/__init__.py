from fastapi import APIRouter

from .user import router as user_router
from .history import router as history_router
from .activity import router as activity_router
from .csv_manipulation import router as csv_router
from .statistics import router as statistics_router
from .pdf import router as pdf_router
from .excel import router as excel_router

main_router = APIRouter()

main_router.include_router(user_router, tags=["User"])
main_router.include_router(history_router, tags=["History"])
main_router.include_router(activity_router, tags=["Activity"])
main_router.include_router(csv_router, tags=["CSV"])
main_router.include_router(statistics_router, tags=["Statistics"])
main_router.include_router(pdf_router, tags=["PDF"])
main_router.include_router(excel_router, tags=["Excel"])