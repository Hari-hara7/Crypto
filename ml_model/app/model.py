import os
import joblib
import yfinance as yf

MODEL_DIR = "app/models"
os.makedirs(MODEL_DIR, exist_ok=True)

# List of supported coins
SUPPORTED_COINS = ["BTC-USD", "ETH-USD", "LTC-USD"]

def load_model(coin: str):
    """Load pretrained model for a coin."""
    path = f"{MODEL_DIR}/{coin}_model.pkl"
    if os.path.exists(path):
        return joblib.load(path)
    else:
        raise FileNotFoundError(f"Model for {coin} not found!")

def predict_trend(coin: str):
    """Predict next hour trend for a given coin."""
    if coin not in SUPPORTED_COINS:
        return {"error": f"{coin} not supported. Supported coins: {SUPPORTED_COINS}"}

    try:
        model = load_model(coin)

        # Fetch last 7 days hourly data from Yahoo Finance
        data = yf.download(tickers=coin, period="7d", interval="1h")
        if data.empty:
            return {"error": "Failed to fetch data from Yahoo Finance."}

        data.reset_index(inplace=True)
        last_time = len(data)
        current_price = float(data["Close"].iloc[-1])

        predicted_price = float(model.predict([[last_time]])[0])
        trend = "Uptrend 📈" if predicted_price > current_price else "Downtrend 📉"

        return {
            "coin": coin,
            "current_price": round(current_price, 2),
            "predicted_price": round(predicted_price, 2),
            "trend": trend
        }

    except Exception as e:
        return {"error": str(e)}
