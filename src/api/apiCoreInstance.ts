import axios from 'axios';
import { httpErrorHandler } from './error/httpErrorHandler';

export const apiCore = axios.create({
  baseURL: 'https://api-tesis-7k22.onrender.com',
  timeout: 100000,
});

apiCore.interceptors.response.use(null, httpErrorHandler);
