import axios from "axios";

const defaultBaseURL =
  import.meta.env.Vite_api_url ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const API = axios.create({
  baseURL: defaultBaseURL,
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API; 


