from fastapi import APIRouter, HTTPException
from SmartWarehouse.app.schemes.user import UserLoginShem
from SmartWarehouse.configFile import Security

router = APIRouter()

@router.post("/login")
def login(creds: UserLoginShem):
    # TODO: login logic
    token = Security.create_access_token(uid=creds.email)
    return {"message": "Login successful", "token": token}
    raise HTTPException(status_code=401, detail="Invalid username or password")