

import { gql } from '@apollo/client';

export const GET_CRYPTO_ASSETS = gql`
  query GetCryptoAssets {
    getCryptoAssets {
      id
      name
      symbol
    }
  }
`;

export const GET_PRICE_HISTORY = gql`
  query GetPriceHistory($symbol: String!) {
    getPriceHistory(symbol: $symbol) {
      price
      timestamp
    }
  }
`;
