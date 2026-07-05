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


def test_create_prompt_returns_201(client, test_user):
    response = client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(
            title="Refactor a React component",
            tags=["react", "refactor"],
        ),
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


def test_create_prompt_rejects_empty_title(client, test_user):
    response = client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(title="   "),
    )

    assert response.status_code == 422


def test_create_prompt_rejects_out_of_range_rating(client, test_user):
    response = client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(rating=6),
    )

    assert response.status_code == 422


def test_get_prompt_returns_404_for_missing_id(client):
    response = client.get("/prompts/99999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Prompt with id 99999 not found"


def test_patch_prompt_partial_update(client, test_user):
    create_response = client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(
            title="Original title",
            content="Original content",
            rating=2,
            tags=["keep-me"],
        ),
    )
    prompt_id = create_response.json()["id"]

    patch_response = client.patch(
        f"/prompts/{prompt_id}",
        json={"rating": 5},
    )

    assert patch_response.status_code == 200
    body = patch_response.json()
    assert body["rating"] == 5
    assert body["title"] == "Original title"
    assert body["content"] == "Original content"
    assert body["tags"] == ["keep-me"]


def test_delete_prompt_then_get_returns_404(client, test_user):
    create_response = client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(title="To be deleted"),
    )
    prompt_id = create_response.json()["id"]

    delete_response = client.delete(f"/prompts/{prompt_id}")
    assert delete_response.status_code == 204

    get_response = client.get(f"/prompts/{prompt_id}")
    assert get_response.status_code == 404
    assert get_response.json()["detail"] == f"Prompt with id {prompt_id} not found"


def test_list_prompts_tag_filter_excludes_similar_tags(client, test_user):
    client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(title="React prompt", tags=["react"]),
    )
    client.post(
        f"/prompts?user_id={test_user.id}",
        json=prompt_payload(title="Reactive prompt", tags=["reactive"]),
    )

    response = client.get("/prompts?tag=react")

    assert response.status_code == 200
    titles = [prompt["title"] for prompt in response.json()]
    assert titles == ["React prompt"]
