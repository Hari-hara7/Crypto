import axios from "axios";

const BASE_URL = "https://crypto-1-iv46.onrender.com/api/auth";

export const register = (data: any) => axios.post(`${BASE_URL}/register`, data);

export const login = (data: any) => axios.post(`${BASE_URL}/login`, data);
