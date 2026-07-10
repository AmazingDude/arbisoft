import os

# INSECURE: local development only — set SECRET_KEY in production.
SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-insecure-secret-change-me")

JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
