// src/components/CryptoList.tsx

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CRYPTO_ASSETS } from '../graphql/queries';
import { Link } from 'react-router-dom';

const CryptoList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_CRYPTO_ASSETS);

  if (loading) return <div>Loading assets...</div>;
  if (error) return <div>Error loading assets</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data?.getCryptoAssets?.map((asset: { id: string; name: string; symbol: string }) => (
        <Link to={`/price-history/${asset.symbol}`} key={asset.id}>
          <div className="bg-gray-800 text-white p-4 rounded-lg cursor-pointer">
            <h2 className="text-xl">{asset.name}</h2>
            <p className="text-gray-400">{asset.symbol}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CryptoList;
