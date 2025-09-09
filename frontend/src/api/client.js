import axios from 'axios';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8088';

console.log('API baseURL =', API_BASE_URL);

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      console.warn('API error:', err.response.status, err.response.data);
    } else {
      console.warn('Network/Unknown error:', err.message);
    }
    return Promise.reject(err);
  }
);

export default client;
