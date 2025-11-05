// ---------------- api.js ----------------
import axios from 'axios';


const API_BASE_URL = 'http://api-maintenance.tech-east.com.pk';


const api = axios.create({
baseURL: API_BASE_URL,
headers: {
'Content-Type': 'application/json',
},
});


// Automatically attach JWT token if stored in localStorage
api.interceptors.request.use((config) => {
const token = localStorage.getItem('jwtToken');
if (token) {
config.headers.Authorization = `Bearer ${token}`;
}
return config;
});


export default api;