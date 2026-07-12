"""Promote an existing user to admin for local RBAC testing.

Why a script (not an API route):
  Registration must always create role="user". An HTTP endpoint that
  promotes anyone (or lets a user promote themselves) would break RBAC —
  attackers could escalate privileges without already being admin. A local
  one-off script run by a developer with direct DB access is the right
  bootstrap tool for this assignment; a real promote-admin API would need
  its own carefully protected admin-only authorization.

Run from the week-2 root:

    py -m scripts.make_admin <username>

Example:

    py -m scripts.make_admin alice
"""

import sys

from sqlalchemy import select

from app.database import SessionLocal
from app.models.user import User


def make_admin(username: str) -> None:
    db = SessionLocal()
    try:
        user = db.scalar(select(User).where(User.username == username))
        if user is None:
            print(f'No user found with username "{username}".')
            sys.exit(1)

        if user.role == "admin":
            print(f'User "{username}" is already an admin.')
            return

        user.role = "admin"
        db.commit()
        print(f'User "{username}" is now an admin (id={user.id}).')
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 2 or not sys.argv[1].strip():
        print("Usage: py -m scripts.make_admin <username>")
        sys.exit(1)

    make_admin(sys.argv[1].strip())
