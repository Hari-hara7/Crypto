// src/pages/PriceHistoryPage.tsx

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRICE_HISTORY } from '../graphql/queries';
import { useParams } from 'react-router-dom';

const PriceHistoryPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();  
  const { data, loading, error } = useQuery(GET_PRICE_HISTORY, {
    variables: { symbol },
    skip: !symbol,  // Skip the query if there's no symbol
  });

  // Handle loading and error states
  if (loading) return <div>Loading price history...</div>;
  if (error) return <div>Error fetching price history</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Price History for {symbol?.toUpperCase()}</h1>
      <div className="space-y-4">
        {data?.getPriceHistory?.map((entry: { price: number; timestamp: string }, index: number) => (
          <div key={index} className="bg-gray-800 text-white p-4 rounded-lg">
            <p>Price: ${entry.price}</p>
            <p>Timestamp: {new Date(entry.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceHistoryPage;
