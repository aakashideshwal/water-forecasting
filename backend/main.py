from fastapi import FastAPI, UploadFile, File, Form
from model import ForecastModel
import pandas as pd
import json
import os

app = FastAPI(title="Water Forecasting API")

UPLOAD_DIR = "data"
RESULT_FILE = "results.json"
os.makedirs(UPLOAD_DIR, exist_ok=True)

model = ForecastModel()

@app.get("/")
def home():
    return {"message": "Welcome to Water Forecasting API!"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    # Assume CSV with columns: date, usage
    df = pd.read_csv(filepath)
    if "usage" not in df.columns:
        return {"error": "CSV must have a 'usage' column"}

    # Save uploaded filename
    return {"message": f"File {file.filename} uploaded successfully"}

@app.post("/forecast")
async def forecast(future_steps: int = Form(5)):
    # Load the last uploaded CSV
    files = os.listdir(UPLOAD_DIR)
    if not files:
        return {"error": "No file uploaded yet"}
    filepath = os.path.join(UPLOAD_DIR, files[-1])
    df = pd.read_csv(filepath)

    # Train + predict
    results = model.train_and_predict(df, future_steps)

    # Save results
    with open(RESULT_FILE, "w") as f:
        json.dump(results, f)

    return results

@app.get("/result")
def get_results():
    if not os.path.exists(RESULT_FILE):
        return {"error": "No results available"}
    with open(RESULT_FILE, "r") as f:
        results = json.load(f)
    return results
