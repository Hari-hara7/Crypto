import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

MODEL_DIR = "app/models"
os.makedirs(MODEL_DIR, exist_ok=True)

coins = ["BTC-USD", "ETH-USD", "LTC-USD"]

for coin in coins:
    print(f"Training model for {coin}...")
    data = yf.download(tickers=coin, period="7d", interval="1h")

    if data.empty:
        print(f"Failed to fetch data for {coin}. Skipping...")
        continue

    data.reset_index(inplace=True)

    # Safely get the Close column as Series
    if "Close" in data.columns:
        y = data["Close"].values  # <-- use .values instead of to_list()
    else:
        print(f"No 'Close' column found for {coin}. Skipping...")
        continue

    X = [[i] for i in range(len(y))]

    model = LinearRegression()
    model.fit(X, y)

    joblib.dump(model, f"{MODEL_DIR}/{coin}_model.pkl")
    print(f"Model for {coin} saved!\n")
