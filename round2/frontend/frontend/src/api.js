import axios from "axios";

const api = axios.create({
    baseURL: "https://intern-production-7fe7.up.railway.app",
});

export default api;