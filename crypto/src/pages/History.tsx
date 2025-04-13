// src/pages/History.tsx

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CRYPTO_ASSETS, GET_PRICE_HISTORY } from '../graphql/queries';

const History: React.FC = () => {
  const { data: assetsData, loading: assetsLoading, error: assetsError } = useQuery(GET_CRYPTO_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const { data: priceHistoryData, loading: priceLoading, error: priceError } = useQuery(GET_PRICE_HISTORY, {
    variables: { symbol: selectedAsset },
    skip: !selectedAsset,
  });

  if (assetsLoading) return <div>Loading assets...</div>;
  if (assetsError) return <div>Error loading assets</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Crypto Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assetsData?.getCryptoAssets?.map((asset: { id: string; name: string; symbol: string }) => (
          <div
            key={asset.id}
            className="bg-gray-800 text-white p-4 rounded-lg cursor-pointer"
            onClick={() => setSelectedAsset(asset.symbol)}
          >
            <h2 className="text-xl">{asset.name}</h2>
            <p className="text-gray-400">{asset.symbol}</p>
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Price History for {selectedAsset}</h2>

          {priceLoading ? (
            <div>Loading price history...</div>
          ) : priceError ? (
            <div>Error loading price history</div>
          ) : (
            <div className="mt-4 space-y-2">
              {priceHistoryData?.getPriceHistory?.map((entry: { price: number; timestamp: string }, index: number) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <p>Price: ${entry.price}</p>
                  <p>Timestamp: {new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default History;
