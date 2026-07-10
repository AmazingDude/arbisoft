import jwt

from app.config import JWT_ALGORITHM, SECRET_KEY
from tests.conftest import bearer_headers, login_user, register_user


def test_register_validation_error_does_not_echo_password(client):
    secret = "leaked-in-422-should-not-appear"
    response = client.post(
        "/auth/register",
        json={"username": "bob", "password": secret},
    )

    assert response.status_code == 422
    assert secret not in response.text


def test_register_rejects_short_password(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "shortpass",
            "email": "short@example.com",
            "password": "short",
        },
    )

    assert response.status_code == 422


def test_login_returns_token_for_valid_credentials(client):
    register_user(client, "alice", "alice@example.com", "validpass1")

    response = client.post(
        "/auth/login",
        json={"username": "alice", "password": "validpass1"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert "access_token" in body

    payload = jwt.decode(
        body["access_token"], SECRET_KEY, algorithms=[JWT_ALGORITHM]
    )
    assert payload["sub"] == "1"
    assert payload["username"] == "alice"
    assert "exp" in payload


def test_login_returns_401_for_invalid_credentials(client):
    register_user(client, "alice", "alice@example.com", "validpass1")

    response = client.post(
        "/auth/login",
        json={"username": "alice", "password": "wrongpassword"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_auth_me_returns_current_user(client):
    register_user(client, "meuser", "me@example.com", "validpass1")
    token = login_user(client, "meuser", "validpass1")

    response = client.get("/auth/me", headers=bearer_headers(token))

    assert response.status_code == 200
    body = response.json()
    assert body["username"] == "meuser"
    assert body["email"] == "me@example.com"
    assert body["role"] == "user"
    assert "id" in body


def test_auth_me_returns_401_without_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"


def test_auth_me_returns_401_with_invalid_token(client):
    response = client.get(
        "/auth/me",
        headers=bearer_headers("not-a-valid-token"),
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid or expired token"


def test_login_returns_401_for_unknown_user(client):
    response = client.post(
        "/auth/login",
        json={"username": "nobody", "password": "validpass1"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"