const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const cryptoAssets = [
  { name: 'Bitcoin', symbol: 'BTC', prices: [45000, 46000] },
  { name: 'Ethereum', symbol: 'ETH', prices: [3000, 3100] },
  { name: 'Cardano', symbol: 'ADA', prices: [1.2, 1.3] },
  { name: 'Solana', symbol: 'SOL', prices: [100, 105] },
  { name: 'Polkadot', symbol: 'DOT', prices: [25, 27] },
  { name: 'Avalanche', symbol: 'AVAX', prices: [80, 83] },
  { name: 'Litecoin', symbol: 'LTC', prices: [200, 210] },
  { name: 'Chainlink', symbol: 'LINK', prices: [30, 31.5] },
  { name: 'Binance Coin', symbol: 'BNB', prices: [400, 410] },
  { name: 'Ripple', symbol: 'XRP', prices: [0.8, 0.85] },
  { name: 'Dogecoin', symbol: 'DOGE', prices: [0.2, 0.21] },
  { name: 'Shiba Inu', symbol: 'SHIB', prices: [0.00003, 0.000031] },
  { name: 'Uniswap', symbol: 'UNI', prices: [20, 21] },
  { name: 'Terra', symbol: 'LUNA', prices: [90, 92] },
  { name: 'Cosmos', symbol: 'ATOM', prices: [35, 36] },
  { name: 'Stellar', symbol: 'XLM', prices: [0.25, 0.27] },
  { name: 'VeChain', symbol: 'VET', prices: [0.1, 0.11] },
  { name: 'Aave', symbol: 'AAVE', prices: [250, 260] },
  { name: 'Monero', symbol: 'XMR', prices: [220, 230] },
  { name: 'Tezos', symbol: 'XTZ', prices: [6, 6.2] },
];

async function main() {
  for (const asset of cryptoAssets) {
    await prisma.cryptoAsset.create({
      data: {
        name: asset.name,
        symbol: asset.symbol,
        priceHistory: {
          create: asset.prices.map(price => ({
            price,
            timestamp: new Date(),
          })),
        },
      },
    });
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
