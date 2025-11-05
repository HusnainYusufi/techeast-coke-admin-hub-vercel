// ---------------- authService.js ----------------
import api from './api';


export const login = async (email, password) => {
try {
const response = await api.post('/auth/login', { email, password });
if (response.data?.status === 200) {
const { jwtToken, userType, username, siteId } = response.data.result;
localStorage.setItem('jwtToken', jwtToken);
localStorage.setItem('userType', userType);
localStorage.setItem('username', username);
localStorage.setItem('siteId', siteId);
}
return response.data;
} catch (error) {
throw error.response?.data || error;
}
};


export const logout = async () => {
localStorage.removeItem('jwtToken');
localStorage.removeItem('userType');
localStorage.removeItem('username');
localStorage.removeItem('siteId');
};