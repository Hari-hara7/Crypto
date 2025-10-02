import React from "react";

interface PredictionProps {
  coin: string;
  current_price: number;
  predicted_price: number;
  trend: string;
}

const PredictionCard: React.FC<PredictionProps> = ({
  coin,
  current_price,
  predicted_price,
  trend,
}) => {
  return (
    <div className="p-6 max-w-sm bg-white border border-gray-200 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold">{coin} Price Prediction</h2>
      <p className="text-gray-600 mt-2">Current: ${current_price}</p>
      <p className="text-gray-600">Predicted: ${predicted_price}</p>
      <p
        className={`mt-3 text-lg font-semibold ${
          trend.includes("Uptrend") ? "text-green-500" : "text-red-500"
        }`}
      >
        {trend}
      </p>
    </div>
  );
};

export default PredictionCard;
