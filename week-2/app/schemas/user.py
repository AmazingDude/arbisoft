from pydantic import BaseModel, ConfigDict, Field, SecretStr


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: SecretStr = Field(min_length=8)

    model_config = ConfigDict(hide_input_in_errors=True)


class UserLogin(BaseModel):
    username: str
    password: SecretStr

    model_config = ConfigDict(hide_input_in_errors=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(UserBase):
    id: int
    role: str

    model_config = ConfigDict(from_attributes=True)
