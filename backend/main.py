from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from model import ForecastModel
import pandas as pd
import json
import os

app = FastAPI(title="Water Forecasting API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "data"
RESULT_FILE = "results.json"
os.makedirs(UPLOAD_DIR, exist_ok=True)

model = ForecastModel()

@app.get("/")
def home():
    return {"message": "Welcome to the Enhanced Water Forecasting API!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    # Save the file first
    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Validate the CSV content
    try:
        df = pd.read_csv(filepath)
        if not {"date", "usage"}.issubset(df.columns):
            raise HTTPException(
                status_code=400,
                detail="CSV validation failed. Required columns are 'date' and 'usage'.",
            )
    except Exception as e:
        # This catches errors from pd.read_csv (e.g., not a CSV) or our validation check
        raise HTTPException(
            status_code=400, detail=f"Failed to process CSV file: {e}"
        )

    return {"message": f"File {file.filename} uploaded and validated successfully."}

@app.post("/forecast")
async def forecast(
    future_steps: int = Form(7),
    latitude: float = Form(28.61),  # Default to New Delhi
    longitude: float = Form(77.23), # Default to New Delhi
):
    files = sorted(os.listdir(UPLOAD_DIR), key=lambda f: os.path.getmtime(os.path.join(UPLOAD_DIR, f)))
    if not files:
        raise HTTPException(status_code=404, detail="No file has been uploaded yet.")

    latest_file = files[-1]
    filepath = os.path.join(UPLOAD_DIR, latest_file)
    df = pd.read_csv(filepath)

    try:
        results = model.train_and_predict(df, latitude, longitude, future_steps)
        # Save results for the /result endpoint
        with open(RESULT_FILE, "w") as f:
            json.dump(results, f)
        return results
    except (ValueError, Exception) as e:
        raise HTTPException(status_code=500, detail=f"An error occurred during forecasting: {e}")

@app.get("/result")
def get_results():
    if not os.path.exists(RESULT_FILE):
        raise HTTPException(status_code=404, detail="No forecast result available.")
    with open(RESULT_FILE, "r") as f:
        results = json.load(f)
    return results