import { useState } from "react";
import { getPrediction } from "../api/prediction";
import PredictionCard from "../components/PredictionCard";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Loader2, TrendingUp, Sparkles, AlertCircle } from "lucide-react";

interface PredictionData {
  coin: string;
  current_price: number;
  predicted_price: number;
  trend: string;
  error?: string;
}

const coins = [
  { value: "BTC-USD", label: "Bitcoin (BTC)", icon: "₿" },
  { value: "ETH-USD", label: "Ethereum (ETH)", icon: "Ξ" },
  { value: "LTC-USD", label: "Litecoin (LTC)", icon: "Ł" }
];

export default function PredictionPage() {
  const [coin, setCoin] = useState(coins[0].value);
  const [data, setData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPrediction = async () => {
    setLoading(true);
    const result = await getPrediction(coin);
    setData(result);
    setLoading(false);
  };

  const selectedCoin = coins.find(c => c.value === coin);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white">
              <Sparkles className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
              AI Price Prediction
            </h1>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Leverage advanced machine learning algorithms to predict cryptocurrency price trends and make informed investment decisions.
          </p>
        </div>

        {/* Control Panel */}
        <Card className="mb-8 shadow-lg border border-gray-700 bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-xl text-white">
              <TrendingUp className="h-5 w-5 text-teal-400" />
              Select Cryptocurrency
            </CardTitle>
            <CardDescription className="text-gray-400">
              Choose a cryptocurrency to analyze its future price movement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="w-full sm:w-auto">
                <Select value={coin} onValueChange={setCoin}>
                  <SelectTrigger className="w-full sm:w-[280px] h-12 bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {coins.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white hover:bg-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-mono text-teal-400">{c.icon}</span>
                          <span>{c.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={fetchPrediction}
                disabled={loading}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Prediction
                  </>
                )}
              </Button>
            </div>

            {selectedCoin && (
              <div className="mt-4 text-center">
                <Badge variant="outline" className="text-sm bg-gray-700 border-gray-600 text-gray-300">
                  <span className="mr-2 text-teal-400">{selectedCoin.icon}</span>
                  Selected: {selectedCoin.label}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="flex justify-center">
          {loading && (
            <Card className="w-full max-w-md shadow-lg bg-gray-800 border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-teal-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">Analyzing Market Data</h3>
                <p className="text-gray-400 text-center">
                  Our AI is processing historical data and market trends to generate your prediction...
                </p>
              </CardContent>
            </Card>
          )}

          {data && !data.error && !loading && (
            <div className="w-full max-w-2xl">
              <div className="text-center mb-6">
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500">
                  Prediction Ready
                </Badge>
              </div>
              <PredictionCard
                coin={data.coin}
                current_price={data.current_price}
                predicted_price={data.predicted_price}
                trend={data.trend}
              />
            </div>
          )}

          {data?.error && !loading && (
            <Card className="w-full max-w-md shadow-lg border-red-600 bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-red-400">
                  Prediction Failed
                </h3>
                <p className="text-red-400 text-center">
                  {data.error}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Section */}
        {!data && !loading && (
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-teal-500/20 w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-teal-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Advanced AI Models</h3>
                <p className="text-sm text-gray-400">
                  Our machine learning algorithms analyze multiple market indicators for accurate predictions.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-cyan-500/20 w-fit mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Real-time Data</h3>
                <p className="text-sm text-gray-400">
                  Get predictions based on the latest market data and trading patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="p-3 rounded-full bg-blue-500/20 w-fit mx-auto mb-4">
                  <AlertCircle className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Risk Assessment</h3>
                <p className="text-sm text-gray-400">
                  Understand potential risks and opportunities with detailed trend analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
