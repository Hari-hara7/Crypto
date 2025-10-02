from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.model import predict_trend

app = FastAPI(
    title="Crypto Trend Prediction API",
    description="Predict 24-hour trend (Uptrend/Downtrend) for selected coins",
    version="1.0.0",
)

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Crypto Prediction API is running 🚀"}

@app.get("/predict/{coin}")
def get_prediction(coin: str):
    return predict_trend(coin)
