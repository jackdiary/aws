import axios from 'axios';

const defaultBaseUrl = 'http://localhost:3001/api';
const envBaseUrl = process.env.REACT_APP_API_BASE_URL;
const normalizedBaseUrl = envBaseUrl
  ? envBaseUrl.replace(/\/+$/, '') + '/api'
  : defaultBaseUrl;

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
});

// JWT 토큰을 자동으로 헤더에 포함하는 인터셉터
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터로 401 오류 시 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
