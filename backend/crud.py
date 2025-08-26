from sqlalchemy.orm import Session
from . import db_models, schemas
from .security import get_password_hash

def get_user_by_email(db: Session, email: str):
    """Fetches a user from the database by their email address."""
    return db.query(db_models.User).filter(db_models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    """Creates a new user in the database with a hashed password."""
    hashed_password = get_password_hash(user.password)
    db_user = db_models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
