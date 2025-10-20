from fastapi import APIRouter, HTTPException
from SmartWarehouse.app.schemes.user import UserLoginShem
from SmartWarehouse.config import security

router = APIRouter()

@router.post("/login")
def login(creds: UserLoginShem):
    # TODO: login logic
    token = security.create_access_token(uid=creds.user_name)
    return {"message": "Login successful", "token": token}
    raise HTTPException(status_code=401, detail="Invalid username or password")