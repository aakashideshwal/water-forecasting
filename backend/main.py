import os
import json
from typing import List

import pandas as pd
from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import crud, db_models, schemas, security
from .database import SessionLocal, engine
from .ml_model import ForecastModel

# Create all database tables
db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Water Forecasting API with Auth")

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependencies ---
def get_db():
    """Dependency to get a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    """Dependency to get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.jwt.decode(token, security.SECRET_KEY, algorithms=[security.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except security.JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# --- Authentication Endpoints ---
@app.post("/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.post("/login", response_model=schemas.Token)
def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_email(db, email=form_data.username) # OAuth2 form uses 'username' for email
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = security.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# --- Forecasting Endpoints (Now Protected) ---

UPLOAD_DIR = "data"
RESULT_FILE = "results.json"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ml_model = ForecastModel()

@app.get("/")
def home():
    return {"message": "Welcome to the Enhanced Water Forecasting API!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), current_user: schemas.User = Depends(get_current_user)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filepath, "wb") as f:
        f.write(await file.read())
    try:
        df = pd.read_csv(filepath)
        if not {"date", "usage"}.issubset(df.columns):
            raise HTTPException(
                status_code=400,
                detail="CSV validation failed. Required columns are 'date' and 'usage'.",
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {e}")
    return {"message": f"File {file.filename} uploaded and validated successfully."}

@app.post("/forecast")
async def forecast(
    future_steps: int = Form(7),
    latitude: float = Form(28.61),
    longitude: float = Form(77.23),
    current_user: schemas.User = Depends(get_current_user),
):
    files = sorted(os.listdir(UPLOAD_DIR), key=lambda f: os.path.getmtime(os.path.join(UPLOAD_DIR, f)))
    if not files:
        raise HTTPException(status_code=404, detail="No file has been uploaded yet.")
    latest_file = files[-1]
    filepath = os.path.join(UPLOAD_DIR, latest_file)
    df = pd.read_csv(filepath)
    try:
        results = ml_model.train_and_predict(df, latitude, longitude, future_steps)
        with open(RESULT_FILE, "w") as f:
            json.dump(results, f)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during forecasting: {e}")

@app.get("/result")
def get_results(current_user: schemas.User = Depends(get_current_user)):
    if not os.path.exists(RESULT_FILE):
        raise HTTPException(status_code=404, detail="No forecast result available.")
    with open(RESULT_FILE, "r") as f:
        results = json.load(f)
    return results
