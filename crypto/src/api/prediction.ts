import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getPrediction = async (coin: string) => {
  const res = await axios.get(`${API_URL}/predict/${coin}`);
  return res.data;
};
