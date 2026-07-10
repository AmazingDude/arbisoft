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


def test_get_prompt_returns_404_for_missing_id(client, auth_headers):
    response = client.get("/prompts/99999", headers=auth_headers)

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

    get_response = client.get(f"/prompts/{prompt_id}", headers=auth_headers)
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

    response = client.get("/prompts?tag=react", headers=auth_headers)

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


def test_non_owner_cannot_read_prompt(client):
    register_user(client, "owner", "owner@example.com", "validpass1")
    owner_token = login_user(client, "owner", "validpass1")

    create_response = client.post(
        "/prompts",
        json=prompt_payload(title="Private prompt"),
        headers=bearer_headers(owner_token),
    )
    prompt_id = create_response.json()["id"]

    register_user(client, "other", "other@example.com", "validpass1")
    other_token = login_user(client, "other", "validpass1")

    response = client.get(
        f"/prompts/{prompt_id}",
        headers=bearer_headers(other_token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Not allowed to view this prompt"


def test_list_prompts_only_shows_current_users_prompts(client):
    register_user(client, "alice", "alice@example.com", "validpass1")
    alice_token = login_user(client, "alice", "validpass1")
    alice_headers = bearer_headers(alice_token)

    register_user(client, "bob", "bob@example.com", "validpass1")
    bob_token = login_user(client, "bob", "validpass1")
    bob_headers = bearer_headers(bob_token)

    client.post(
        "/prompts",
        json=prompt_payload(title="Alice prompt"),
        headers=alice_headers,
    )
    client.post(
        "/prompts",
        json=prompt_payload(title="Bob prompt"),
        headers=bob_headers,
    )

    alice_list = client.get("/prompts", headers=alice_headers)
    assert alice_list.status_code == 200
    assert [prompt["title"] for prompt in alice_list.json()] == ["Alice prompt"]

    bob_list = client.get("/prompts", headers=bob_headers)
    assert bob_list.status_code == 200
    assert [prompt["title"] for prompt in bob_list.json()] == ["Bob prompt"]


def test_admin_can_read_all_prompts(client, db):
    register_user(client, "alice", "alice@example.com", "validpass1")
    alice_token = login_user(client, "alice", "validpass1")

    register_user(client, "bob", "bob@example.com", "validpass1")
    bob_token = login_user(client, "bob", "validpass1")

    client.post(
        "/prompts",
        json=prompt_payload(title="Alice prompt"),
        headers=bearer_headers(alice_token),
    )
    client.post(
        "/prompts",
        json=prompt_payload(title="Bob prompt"),
        headers=bearer_headers(bob_token),
    )

    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=hash_password("validpass1"),
        role="admin",
    )
    db.add(admin)
    db.commit()

    admin_token = login_user(client, "admin", "validpass1")
    response = client.get("/prompts", headers=bearer_headers(admin_token))

    assert response.status_code == 200
    titles = sorted(prompt["title"] for prompt in response.json())
    assert titles == ["Alice prompt", "Bob prompt"]


def test_user_cannot_view_other_users_prompt_list(client, test_user):
    register_user(client, "other", "other@example.com", "validpass1")
    other_token = login_user(client, "other", "validpass1")

    response = client.get(
        f"/users/{test_user.id}/prompts",
        headers=bearer_headers(other_token),
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Not allowed to view this user's prompts"
