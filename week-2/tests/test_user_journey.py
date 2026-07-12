from tests.conftest import bearer_headers, login_user, register_user
from tests.test_prompts import prompt_payload


def test_full_user_journey_integration(client):
    """One connected session: register -> login -> create -> read -> update -> delete."""
    password = "validpass1"
    register_response = register_user(
        client, "journeyuser", "journey@example.com", password
    )
    assert register_response.status_code == 201
    user = register_response.json()
    assert user["username"] == "journeyuser"
    assert user["email"] == "journey@example.com"
    assert "password" not in user
    assert "hashed_password" not in user

    token = login_user(client, "journeyuser", password)
    headers = bearer_headers(token)

    create_payload = prompt_payload(
        title="Journey prompt",
        content="Created during the full user journey.",
        tool="Claude",
        model="claude-3.5-sonnet",
        rating=4,
        tags=["journey", "integration"],
        notes="initial notes",
    )
    create_response = client.post("/prompts", json=create_payload, headers=headers)
    assert create_response.status_code == 201
    created = create_response.json()
    prompt_id = created["id"]
    assert created["title"] == create_payload["title"]
    assert created["content"] == create_payload["content"]
    assert created["tool"] == create_payload["tool"]
    assert created["model"] == create_payload["model"]
    assert created["rating"] == create_payload["rating"]
    assert created["tags"] == create_payload["tags"]
    assert created["notes"] == create_payload["notes"]
    assert created["user_id"] == user["id"]

    get_response = client.get(f"/prompts/{prompt_id}", headers=headers)
    assert get_response.status_code == 200
    fetched = get_response.json()
    assert fetched["id"] == prompt_id
    assert fetched["title"] == create_payload["title"]
    assert fetched["content"] == create_payload["content"]
    assert fetched["tags"] == create_payload["tags"]
    assert fetched["user_id"] == user["id"]

    update_response = client.patch(
        f"/prompts/{prompt_id}",
        json={
            "title": "Journey prompt updated",
            "rating": 5,
            "tags": ["journey", "updated"],
            "notes": "updated notes",
        },
        headers=headers,
    )
    assert update_response.status_code == 200
    updated = update_response.json()
    assert updated["id"] == prompt_id
    assert updated["title"] == "Journey prompt updated"
    assert updated["rating"] == 5
    assert updated["tags"] == ["journey", "updated"]
    assert updated["notes"] == "updated notes"
    assert updated["content"] == create_payload["content"]

    confirm_update = client.get(f"/prompts/{prompt_id}", headers=headers)
    assert confirm_update.status_code == 200
    assert confirm_update.json()["title"] == "Journey prompt updated"
    assert confirm_update.json()["rating"] == 5

    delete_response = client.delete(f"/prompts/{prompt_id}", headers=headers)
    assert delete_response.status_code == 204

    missing_response = client.get(f"/prompts/{prompt_id}", headers=headers)
    assert missing_response.status_code == 404
    assert missing_response.json()["detail"] == f"Prompt with id {prompt_id} not found"
