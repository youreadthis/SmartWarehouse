from fastapi import APIRouter, HTTPException
from ..schemes.user import UserLoginShem
from configFile import Security
from models import users_methods

router = APIRouter()

@router.post("/login")
def login(creds: UserLoginShem):
    if users_methods.login(email=creds.email, password=creds.password):
        token = Security.create_access_token(uid=creds.email)
        return {"message": "Login successful", "token": token}
    raise HTTPException(status_code=401, detail="Invalid username or password")