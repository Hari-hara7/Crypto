// src/graphql/resolvers.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    // Fetch all crypto assets
    getCryptoAssets: async () => {
      try {
        return await prisma.cryptoAsset.findMany();
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch crypto assets');
      }
    },

    // Fetch price history for a specific crypto asset by symbol
    getPriceHistory: async (_, { symbol }) => {
      try {
        // Find the crypto asset based on its symbol
        const asset = await prisma.cryptoAsset.findUnique({
          where: {
            symbol: symbol,  // Use the symbol to find the asset
          },
          include: {
            priceHistory: true,  // Include related price history records
          },
        });

        if (!asset) {
          throw new Error(`Crypto asset with symbol "${symbol}" not found`);
        }

        return asset.priceHistory;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch price history');
      }
    },
  },
};

module.exports = resolvers;
