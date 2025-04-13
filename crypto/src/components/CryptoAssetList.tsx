// src/components/CryptoAssetList.tsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_CRYPTO_ASSETS = gql`
  query GetCryptoAssets {
    getCryptoAssets {
      id
      name
      symbol
    }
  }
`;

const CryptoAssetList: React.FC = () => {
  const { loading, error, data } = useQuery(GET_CRYPTO_ASSETS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="space-y-4">
      {data.getCryptoAssets.map((asset: { id: string; name: string; symbol: string }) => (
        <div
          key={asset.id}
          className="p-4 bg-gray-800 text-white rounded-md shadow-md"
        >
          <h2 className="text-xl font-semibold">{asset.name} ({asset.symbol})</h2>
          <PriceHistory symbol={asset.symbol} />
        </div>
      ))}
    </div>
  );
};

export default CryptoAssetList;
