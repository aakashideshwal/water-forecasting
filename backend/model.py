import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

class ForecastModel:
    def __init__(self):
        self.model = LinearRegression()

    def train_and_predict(self, df: pd.DataFrame, future_steps: int = 5):
        """
        Expects df with two columns: 'day' (time index) and 'usage' (water usage).
        """
        X = np.array(df.index).reshape(-1, 1)  # use row index as time
        y = df['usage'].values
        self.model.fit(X, y)

        X_future = np.array([len(df) + i for i in range(1, future_steps + 1)]).reshape(-1, 1)
        predictions = self.model.predict(X_future)

        results = {
            "future_steps": future_steps,
            "predictions": predictions.tolist()
        }
        return results
