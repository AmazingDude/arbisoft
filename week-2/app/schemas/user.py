from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str
    email: str


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
