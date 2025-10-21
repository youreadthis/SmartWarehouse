from pydantic import Field, BaseModel,EmailStr

class UserLoginShem(BaseModel):
    email: EmailStr
    user_name: str = Field(min_length=1, max_length= 100)
    password: str = Field(min_length=8)
