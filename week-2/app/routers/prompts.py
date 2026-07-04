from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.prompt import Prompt
from app.models.user import User
from app.schemas.prompt import PromptCreate, PromptResponse, PromptUpdate

router = APIRouter(prefix="/prompts", tags=["prompts"])
users_router = APIRouter(prefix="/users", tags=["users"])


def get_user_or_404(db: Session, user_id: int) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with id {user_id} not found",
        )
    return user


def get_prompt_or_404(db: Session, prompt_id: int) -> Prompt:
    prompt = db.get(Prompt, prompt_id)
    if prompt is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Prompt with id {prompt_id} not found",
        )
    return prompt


@router.post("", status_code=status.HTTP_201_CREATED, response_model=PromptResponse)
def create_prompt(
    data: PromptCreate,
    user_id: int = Query(..., description="Owner user id (temporary until auth)"),
    db: Session = Depends(get_db),
):
    get_user_or_404(db, user_id)

    payload = data.model_dump()
    tags = payload.pop("tags")

    prompt = Prompt(**payload, user_id=user_id)
    prompt.set_tags_list(tags)

    db.add(prompt)
    db.commit()
    db.refresh(prompt)
    return prompt


@router.get("", response_model=list[PromptResponse])
def list_prompts(
    tool: str | None = Query(default=None, description="Filter by tool name"),
    tag: str | None = Query(default=None, description="Filter by tag substring"),
    db: Session = Depends(get_db),
):
    query = select(Prompt)

    if tool is not None:
        query = query.where(Prompt.tool == tool)
    if tag is not None:
        query = query.where(Prompt.tags.contains(tag))

    return db.scalars(query).all()


@router.get("/{prompt_id}", response_model=PromptResponse)
def get_prompt(prompt_id: int, db: Session = Depends(get_db)):
    return get_prompt_or_404(db, prompt_id)


@router.patch("/{prompt_id}", response_model=PromptResponse)
def update_prompt(
    prompt_id: int,
    data: PromptUpdate,
    db: Session = Depends(get_db),
):
    prompt = get_prompt_or_404(db, prompt_id)
    updates = data.model_dump(exclude_unset=True)
    tags = updates.pop("tags", None)

    for field, value in updates.items():
        setattr(prompt, field, value)
    if tags is not None:
        prompt.set_tags_list(tags)

    db.commit()
    db.refresh(prompt)
    return prompt


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prompt(prompt_id: int, db: Session = Depends(get_db)):
    prompt = get_prompt_or_404(db, prompt_id)
    db.delete(prompt)
    db.commit()


@users_router.get("/{user_id}/prompts", response_model=list[PromptResponse])
def list_user_prompts(user_id: int, db: Session = Depends(get_db)):
    user = get_user_or_404(db, user_id)
    return user.prompts
