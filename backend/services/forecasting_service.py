import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def forecast_water_demand(csv_path: str, future_days: int = 30):
    # Load CSV (expects a 'date' and 'usage' column)
    df = pd.read_csv(csv_path, parse_dates=["date"])
    df = df.sort_values("date")

    # Convert dates to numeric (days since start)
    df["days"] = (df["date"] - df["date"].min()).dt.days

    X = df[["days"]].values
    y = df["usage"].values

    model = LinearRegression()
    model.fit(X, y)

    # Forecast for next N days
    last_day = df["days"].max()
    future_days_arr = np.arange(last_day+1, last_day+future_days+1).reshape(-1,1)
    predictions = model.predict(future_days_arr)

    forecast_df = pd.DataFrame({
        "date": pd.date_range(start=df["date"].max() + pd.Timedelta(days=1), periods=future_days),
        "predicted_usage": predictions
    })

    return forecast_df
