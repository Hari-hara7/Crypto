// src/components/PriceHistory.tsx

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRICE_HISTORY } from '../graphql/queries';

interface PriceHistoryProps {
  symbol: string;
}

const PriceHistory: React.FC<PriceHistoryProps> = ({ symbol }) => {
  const { data, loading, error } = useQuery(GET_PRICE_HISTORY, {
    variables: { symbol },
  });

  if (loading) return <div>Loading price history...</div>;
  if (error) return <div>Error loading price history</div>;

  return (
    <div className="mt-4 space-y-2">
      {data?.getPriceHistory?.map((entry: { price: number; timestamp: string }, index: number) => (
        <div key={index} className="bg-gray-700 p-4 rounded-lg">
          <p>Price: ${entry.price}</p>
          <p>Timestamp: {new Date(entry.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PriceHistory;
