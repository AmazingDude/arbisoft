"""Create all database tables. Run from the week-2 root:

    python -m scripts.init_db
"""

from app.database import Base, engine
from app.models import Prompt, User  # noqa: F401

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Database tables created.")
