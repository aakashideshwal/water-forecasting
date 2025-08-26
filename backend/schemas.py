from pydantic import BaseModel
from typing import Optional

# Pydantic model for the token
class Token(BaseModel):
    access_token: str
    token_type: str

# Pydantic model for the data embedded in the token
class TokenData(BaseModel):
    email: Optional[str] = None

# Base model for User data
class UserBase(BaseModel):
    email: str

# Model for creating a new user (expects a password)
class UserCreate(UserBase):
    password: str

# Model for reading user data (does not include password)
class User(UserBase):
    id: int

    class Config:
        from_attributes = True
