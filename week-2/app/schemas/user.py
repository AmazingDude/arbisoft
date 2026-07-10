from pydantic import BaseModel, ConfigDict, Field, SecretStr


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: SecretStr = Field(min_length=8)

    model_config = ConfigDict(hide_input_in_errors=True)


class UserResponse(UserBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
