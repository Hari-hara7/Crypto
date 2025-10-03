import yfinance as yf
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os

MODEL_DIR = "app/models"
CACHE_DIR = "app/cache"
os.makedirs(MODEL_DIR, exist_ok=True)
os.makedirs(CACHE_DIR, exist_ok=True)

coins = ["BTC-USD", "ETH-USD", "LTC-USD"]

for coin in coins:
    print(f"Training model for {coin}...")
    data = yf.download(tickers=coin, period="7d", interval="1h")
    data.reset_index(inplace=True)

    # Save dataset for each coin
    csv_path = f"{CACHE_DIR}/{coin}_data.csv"
    data.to_csv(csv_path, index=False)
    print(f"Dataset saved: {csv_path}")

    # Train Linear Regression
    X = [[i] for i in range(len(data))]
    y = data["Close"].to_numpy()  # safe way instead of to_list

    model = LinearRegression()
    model.fit(X, y)

    # Save model
    model_path = f"{MODEL_DIR}/{coin}_model.pkl"
    joblib.dump(model, model_path)
    print(f"Model saved: {model_path}\n")
