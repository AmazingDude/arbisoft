from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PromptBase(BaseModel):
    title: str
    content: str
    tool: str
    model: str | None = None
    rating: int
    tags: list[str] = Field(default_factory=list)
    notes: str | None = None

    @field_validator("tags", mode="before")
    @classmethod
    def parse_tags(cls, value: str | list[str] | None) -> list[str]:
        if value is None:
            return []
        if isinstance(value, str):
            if not value:
                return []
            return [tag.strip() for tag in value.split(",") if tag.strip()]
        return value


class PromptCreate(PromptBase):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)
    rating: int = Field(ge=1, le=5)

    @field_validator("title", "content")
    @classmethod
    def strip_and_require_non_empty(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("must not be empty")
        return stripped


class PromptUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    tool: str | None = None
    model: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)
    tags: list[str] | None = None
    notes: str | None = None

    @field_validator("title", "content")
    @classmethod
    def strip_and_require_non_empty_when_provided(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        if not stripped:
            raise ValueError("must not be empty")
        return stripped


class PromptResponse(PromptBase):
    id: int
    created_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)
