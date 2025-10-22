from pydantic import Field, BaseModel,EmailStr

class UserLoginShem(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
