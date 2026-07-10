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
