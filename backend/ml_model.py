import pandas as pd
import requests
from sklearn.linear_model import LinearRegression
from datetime import timedelta

# Open-Meteo API URLs
WEATHER_API_URL = "https://api.open-meteo.com/v1/forecast"
ARCHIVE_API_URL = "https://archive-api.open-meteo.com/v1/era5"

def get_weather_data(latitude, longitude, start_date, end_date):
    """
    Fetches daily weather data. It intelligently chooses between the archive API for historical
    data and the forecast API for future data.
    """
    # Determine which API to use based on the end_date
    from datetime import datetime
    is_historical = datetime.strptime(end_date, "%Y-%m-%d") < datetime.now()
    
    url = ARCHIVE_API_URL if is_historical else WEATHER_API_URL

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "daily": "temperature_2m_max,precipitation_sum",
        "timezone": "auto",
        "start_date": start_date,
        "end_date": end_date,
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        error_details = response.text
        raise Exception(
            f"Failed to fetch weather data from Open-Meteo API. "
            f"Status Code: {response.status_code}. Details: {error_details}"
        )

    data = response.json()
    df = pd.DataFrame(data["daily"])
    df["time"] = pd.to_datetime(df["time"])
    df.rename(
        columns={
            "time": "date",
            "temperature_2m_max": "temp_max",
            "precipitation_sum": "precipitation",
        },
        inplace=True,
    )
    return df

class ForecastModel:
    def __init__(self):
        self.model = LinearRegression()

    def train_and_predict(self, user_df: pd.DataFrame, latitude: float, longitude: float, future_steps: int = 7):
        """
        Trains a model on historical usage and weather data, then predicts future usage
        based on weather forecasts.

        Args:
            user_df (pd.DataFrame): DataFrame with 'date' and 'usage' columns.
            latitude (float): Latitude for weather data.
            longitude (float): Longitude for weather data.
            future_steps (int): Number of future days to predict.

        Returns:
            dict: A dictionary containing original data, weather data, and predictions.
        """
        # Ensure date column is in datetime format
        user_df["date"] = pd.to_datetime(user_df["date"])
        user_df.sort_values("date", inplace=True)

        # Get historical weather data matching the user's data range
        start_date = user_df["date"].min().strftime("%Y-%m-%d")
        end_date = user_df["date"].max().strftime("%Y-%m-%d")
        historical_weather_df = get_weather_data(latitude, longitude, start_date, end_date)

        # Merge user data with historical weather data
        training_df = pd.merge(user_df, historical_weather_df, on="date", how="inner")

        if training_df.empty:
            raise ValueError("No matching weather data found for the dates in the uploaded file. Please check the date range.")

        # Train the model
        features = ["temp_max", "precipitation"]
        X_train = training_df[features]
        y_train = training_df["usage"]
        self.model.fit(X_train, y_train)

        # Get future weather forecast to use for prediction
        future_start_date = (user_df["date"].max() + timedelta(days=1)).strftime("%Y-%m-%d")
        future_end_date = (user_df["date"].max() + timedelta(days=future_steps)).strftime("%Y-%m-%d")
        future_weather_df = get_weather_data(latitude, longitude, future_start_date, future_end_date)

        # Predict future usage based on the weather forecast
        X_future = future_weather_df[features]
        future_predictions = self.model.predict(X_future)

        # Prepare results
        result_df = future_weather_df.copy()
        result_df["predicted_usage"] = future_predictions

        # Convert date columns to string format for JSON compatibility
        training_df['date'] = training_df['date'].dt.strftime('%Y-%m-%d')
        result_df['date'] = result_df['date'].dt.strftime('%Y-%m-%d')

        return {
            "historical_data": training_df.to_dict("records"),
            "forecast": result_df.to_dict("records"),
        }