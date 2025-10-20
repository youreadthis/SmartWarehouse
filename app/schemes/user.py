from pydantic import Field, BaseModel

class UserLoginShem(BaseModel):
    user_name: str = Field(min_length=1, max_length= 100)
    password: str = Field(min_length=8)

