// src/graphql/queries.ts

import { gql } from '@apollo/client';

// Query to fetch all crypto assets
export const GET_CRYPTO_ASSETS = gql`
  query GetCryptoAssets {
    getCryptoAssets {
      id
      name
      symbol
    }
  }
`;

// Query to fetch price history of a crypto asset by symbol
export const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($symbol: String!) {
    getPriceHistory(symbol: $symbol) {
      price
      timestamp
    }
  }
`;
