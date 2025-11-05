// ---------------- dashboard.js ----------------
import api from './api';


export const getCokeAdminOverview = async (page = 1, limit = 20) => {
try {
const response = await api.get(`/coke-admin/overview?page=${page}&limit=${limit}`);
return response.data;
} catch (error) {
throw error.response?.data || error;
}
};