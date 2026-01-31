from fastapi import APIRouter, HTTPException
from configFile import Security
from models import users_methods
from json import loads

router = APIRouter()

@router.post("/login")
async def login(creds: str):
    creds_as_json = loads(creds)
    login_res =  users_methods.login(email=creds_as_json["email"], password=creds_as_json["password"])
    if login_res:
        token = Security.create_access_token(uid=creds_as_json["email"])
        return {"message": "Login successful", "token": token, "name": login_res[0].name, "role": login_res[0].role}
    raise HTTPException(status_code=401, detail="Invalid username or password")