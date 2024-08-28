import axios from 'axios';

// Utility function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8800',
    withCredentials: true // Include credentials (cookies)
});

// Intercept requests to include the token
axiosInstance.interceptors.request.use(config => {
    const token = getCookie('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;