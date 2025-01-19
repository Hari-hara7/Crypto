const BASE_URL = "https://api.coingecko.com/api/v3";

export const fetchCoins = async () => {
  const response = await fetch(`${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc`);
  return response.json();
};

export const fetchNews = async () => {
  const response = await fetch("https://min-api.cryptocompare.com/data/v2/news/?lang=EN");
  return response.json();
};
