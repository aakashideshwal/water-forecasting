from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import os
import shutil
import uuid
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA

# Initialize FastAPI
app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # in production: replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running!"}

# ---------- STEP 2: File Upload ----------
UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate file type
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    # Create unique file id
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.csv")

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"message": "File uploaded successfully", "dataset_id": file_id}


# ---------- STEP 4: Forecast Endpoint ----------
@app.get("/api/forecast/{dataset_id}")
async def get_forecast(dataset_id: str):
    file_path = os.path.join(UPLOAD_DIR, f"{dataset_id}.csv")

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Dataset not found")

    try:
        # Load CSV
        df = pd.read_csv(file_path)

        # ✅ Assumption: CSV has columns ["date", "usage"]
        if "date" not in df.columns or "usage" not in df.columns:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain 'date' and 'usage' columns"
            )

        # Convert date column
        df["date"] = pd.to_datetime(df["date"])
        df = df.sort_values("date")

        # Train ARIMA model
        model = ARIMA(df["usage"], order=(2, 1, 2))
        model_fit = model.fit()

        # Forecast next 30 days
        forecast = model_fit.forecast(steps=30)

        # Build response
        forecast_result = []
        last_date = df["date"].max()
        for i, val in enumerate(forecast):
            forecast_result.append({
                "date": (last_date + pd.Timedelta(days=i+1)).strftime("%Y-%m-%d"),
                "predicted_usage": round(float(val), 2)
            })

        return JSONResponse(content={
            "dataset_id": dataset_id,
            "forecast": forecast_result
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Forecasting failed: {str(e)}")
