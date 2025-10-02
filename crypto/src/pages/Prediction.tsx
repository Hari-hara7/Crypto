import React, { useState } from "react";
import { getPrediction } from "../api/prediction";
import PredictionCard from "../components/PredictionCard";

export default function PredictionPage() {
  const [coin, setCoin] = useState("BTC-USD");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    const result = await getPrediction(coin);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">🔮 Price Trend Prediction</h1>
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={coin}
          onChange={(e) => setCoin(e.target.value)}
          className="border rounded-lg px-4 py-2"
          placeholder="e.g. BTC-USD"
        />
        <button
          onClick={fetchPrediction}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Predict
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {data && (
        <PredictionCard
          coin={data.coin}
          current_price={data.current_price}
          predicted_price={data.predicted_price}
          trend={data.trend}
        />
      )}
    </div>
  );
}
