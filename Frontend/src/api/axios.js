import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Node.js service
});

export default api;
