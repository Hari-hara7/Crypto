

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {

    getCryptoAssets: async () => {
      try {
        return await prisma.cryptoAsset.findMany();
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch crypto assets');
      }
    },


    getPriceHistory: async (_, { symbol }) => {
      try {
  
        const asset = await prisma.cryptoAsset.findUnique({
          where: {
            symbol: symbol, 
          },
          include: {
            priceHistory: true,  
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
