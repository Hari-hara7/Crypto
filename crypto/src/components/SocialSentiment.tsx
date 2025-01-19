// src/components/SocialSentiment.tsx

import React, { useEffect, useState } from 'react';
import { fetchSentiment } from '../utils/sentimentAPI';

interface SentimentProps {
  coinId: string; // Unique coin ID to fetch sentiment data for that coin
}

const SocialSentiment: React.FC<SentimentProps> = ({ coinId }) => {
  const [sentimentData, setSentimentData] = useState<{ sentiment: string, mentions: number } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSentimentData = async () => {
      setLoading(true);
      const data = await fetchSentiment(coinId);
      setSentimentData(data);
      setLoading(false);
    };

    getSentimentData();
  }, [coinId]);

  if (loading) {
    return <div>Loading sentiment data...</div>;
  }

  if (!sentimentData) {
    return <div>Error fetching sentiment data.</div>;
  }

  return (
    <div className="sentiment-card p-4 rounded-lg bg-gray-100">
      <h3 className="text-xl font-bold mb-2">Social Sentiment for {coinId}</h3>
      <div className={`sentiment-${sentimentData.sentiment}`}>
        <p>Sentiment: {sentimentData.sentiment}</p>
        <p>Mentions: {sentimentData.mentions}</p>
      </div>
    </div>
  );
};

export default SocialSentiment;
