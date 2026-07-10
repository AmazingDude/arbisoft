from app.models.user import User
from app.security import hash_password
from tests.conftest import bearer_headers, login_user, register_user


def prompt_payload(**overrides: object) -> dict:
    data = {
        "title": "Test Prompt",
        "content": "Test content for the prompt.",
        "tool": "Claude",
        "model": "claude-3.5-sonnet",
        "rating": 4,
        "tags": ["test"],
        "notes": "Some notes",
    }
    data.update(overrides)
    return data


def test_create_prompt_returns_201(client, test_user, auth_headers):
    response = client.post(
        "/prompts",
        json=prompt_payload(
            title="Refactor a React component",
            tags=["react", "refactor"],
        ),
        headers=auth_headers,
    )

    assert response.status_code == 201
    body = response.json()
    assert body["title"] == "Refactor a React component"
    assert body["content"] == "Test content for the prompt."
    assert body["tool"] == "Claude"
    assert body["model"] == "claude-3.5-sonnet"
    assert body["rating"] == 4
    assert body["tags"] == ["react", "refactor"]
    assert body["notes"] == "Some notes"
    assert body["user_id"] == test_user.id
    assert "id" in body
    assert "created_at" in body


def test_create_prompt_rejects_empty_title(client, auth_headers):
    response = client.post(
        "/prompts",
        json=prompt_payload(title="   "),
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_create_prompt_rejects_out_of_range_rating(client, auth_headers):
    response = client.post(
        "/prompts",
        json=prompt_payload(rating=6),
        headers=auth_headers,
    )

    assert response.status_code == 422


def test_get_prompt_returns_404_for_missing_id(client):
    response = client.get("/prompts/99999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Prompt with id 99999 not found"


def test_patch_prompt_partial_update(client, auth_headers):
    create_response = client.post(
        "/prompts",
        json=prompt_payload(
            title="Original title",
            content="Original content",
            rating=2,
            tags=["keep-me"],
        ),
        headers=auth_headers,
    )
    prompt_id = create_response.json()["id"]

    patch_response = client.patch(
        f"/prompts/{prompt_id}",
        json={"rating": 5},
        headers=auth_headers,
    )

    assert patch_response.status_code == 200
    body = patch_response.json()
    assert body["rating"] == 5
    assert body["title"] == "Original title"
    assert body["content"] == "Original content"
    assert body["tags"] == ["keep-me"]


def test_delete_prompt_then_get_returns_404(client, auth_headers):
    create_response = client.post(
        "/prompts",
        json=prompt_payload(title="To be deleted"),
        headers=auth_headers,
    )
    prompt_id = create_response.json()["id"]

    delete_response = client.delete(f"/prompts/{prompt_id}", headers=auth_headers)
    assert delete_response.status_code == 204

    get_response = client.get(f"/prompts/{prompt_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == f"Prompt with id {prompt_id} not found"


def test_list_prompts_tag_filter_excludes_similar_tags(client, auth_headers):
    client.post(
        "/prompts",
        json=prompt_payload(title="React prompt", tags=["react"]),
        headers=auth_headers,
    )
    client.post(
        "/prompts",
        json=prompt_payload(title="Reactive prompt", tags=["reactive"]),
        headers=auth_headers,
    )

    response = client.get("/prompts?tag=react")

    assert response.status_code == 200
    titles = [prompt["title"] for prompt in response.json()]
    assert titles == ["React prompt"]


def test_non_owner_cannot_delete_prompt(client, db):
    register_user(client, "owner", "owner@example.com", "validpass1")
    owner_token = login_user(client, "owner", "validpass1")

    create_response = client.post(
        "/prompts",
        json=prompt_payload(title="Owner prompt"),
        headers=bearer_headers(owner_token),
    )
    prompt_id = create_response.json()["id"]

    register_user(client, "other", "other@example.com", "validpass1")
    other_token = login_user(client, "other", "validpass1")

    delete_response = client.delete(
        f"/prompts/{prompt_id}",
        headers=bearer_headers(other_token),
    )
    assert delete_response.status_code == 403
    assert delete_response.json()["detail"] == "Not allowed to modify this prompt"

    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=hash_password("validpass1"),
        role="admin",
    )
    db.add(admin)
    db.commit()

    admin_token = login_user(client, "admin", "validpass1")
    admin_delete_response = client.delete(
        f"/prompts/{prompt_id}",
        headers=bearer_headers(admin_token),
    )
    assert admin_delete_response.status_code == 204
