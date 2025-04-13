// src/graphql/schema.js

const { gql } = require('apollo-server');

const typeDefs = gql`
  type CryptoAsset {
    id: String
    name: String
    symbol: String
    priceHistory: [PriceHistory]
  }

  type PriceHistory {
    id: String
    price: Float
    timestamp: String
  }

  type Query {
    getCryptoAssets: [CryptoAsset]
    getPriceHistory(symbol: String!): [PriceHistory]
  }
`;

module.exports = typeDefs;
