import axios from 'axios';

const defaultBaseUrl = 'http://localhost:3001/api';
const envBaseUrl = process.env.REACT_APP_API_BASE_URL;
const normalizedBaseUrl = envBaseUrl
  ? envBaseUrl.replace(/\/+$/, '')
  : defaultBaseUrl;

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
});

export default apiClient;
