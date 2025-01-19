// src/utils/sentimentAPI.ts

import axios from 'axios';

// Example API URL, replace with actual API you are using
const SENTIMENT_API_URL = 'https://api.coinlib.io/v1/coin/coinSentiment';

export const fetchSentiment = async (coinId: string) => {
  try {
    const response = await axios.get(SENTIMENT_API_URL, {
      params: {
        coinId,
      },
    });

    // Assuming the API returns sentiment data in the following structure
    return response.data; // { sentiment: 'positive', mentions: 1200 }
  } catch (error) {
    console.error('Error fetching sentiment data', error);
    return null;
  }
};
