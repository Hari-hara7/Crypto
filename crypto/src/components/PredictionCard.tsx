import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

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
  const isUptrend = trend.toLowerCase().includes("uptrend") || trend.toLowerCase().includes("up");
  const priceChange = predicted_price - current_price;
  const percentageChange = ((priceChange / current_price) * 100).toFixed(2);

  return (
    <Card className="w-full max-w-sm transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gray-800 border-gray-700 border-l-4 border-l-teal-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-teal-500/20">
              <DollarSign className="h-4 w-4 text-teal-400" />
            </div>
            <span className="text-white">{coin} Prediction</span>
          </span>
          <Badge 
            variant={isUptrend ? "default" : "destructive"}
            className={`flex items-center gap-1 ${
              isUptrend 
                ? "bg-teal-500/20 text-teal-400 border-teal-500" 
                : "bg-red-500/20 text-red-400 border-red-500"
            }`}
          >
            {isUptrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(parseFloat(percentageChange))}%
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <DollarSign className="h-3 w-3" />
              Current Price
            </div>
            <p className="text-lg font-semibold text-white">
              ${current_price.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Target className="h-3 w-3" />
              Predicted Price
            </div>
            <p className="text-lg font-semibold text-white">
              ${predicted_price.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Price Change</span>
            <span className={`text-sm font-medium ${
              priceChange >= 0 ? "text-teal-400" : "text-red-400"
            }`}>
              {priceChange >= 0 ? "+" : ""}${priceChange.toLocaleString()}
            </span>
          </div>
          
          <div className="mt-2">
            <Badge 
              variant={isUptrend ? "default" : "destructive"}
              className={`w-full justify-center text-sm font-medium ${
                isUptrend 
                  ? "bg-teal-500/20 text-teal-400 border-teal-500" 
                  : "bg-red-500/20 text-red-400 border-red-500"
              }`}
            >
              {trend}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
