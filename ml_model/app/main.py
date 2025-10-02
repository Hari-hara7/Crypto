from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.model import predict_trend, SUPPORTED_COINS

app = FastAPI(
    title="Crypto Trend Prediction API",
    description="Predict 24-hour trend (Uptrend/Downtrend) for multiple coins",
    version="1.1.0",
)

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Crypto Prediction API is running 🚀", "supported_coins": SUPPORTED_COINS}

@app.get("/predict/{coin}")
def get_prediction(coin: str):
    return predict_trend(coin)
