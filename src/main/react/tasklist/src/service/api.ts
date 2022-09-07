import axios from 'axios';
import { env } from '../env';
const api = axios.create({
  baseURL: `http://${env.backend}`
});

export default api;
