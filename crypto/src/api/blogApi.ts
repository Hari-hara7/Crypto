import axios from "axios";

const BASE_URL = "http://localhost:5000/api/blogs";

export const createBlog = (data: any, token: string) =>
  axios.post(BASE_URL, data, { headers: { Authorization: `Bearer ${token}` } });

export const getAllBlogs = () => axios.get(BASE_URL);

export const getBlogById = (id: string) => axios.get(`${BASE_URL}/${id}`);

export const likeBlog = (id: string, token: string) =>
  axios.post(`${BASE_URL}/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });

export const commentBlog = (id: string, comment: any, token: string) =>
  axios.post(`${BASE_URL}/${id}/comment`, comment, { headers: { Authorization: `Bearer ${token}` } });
