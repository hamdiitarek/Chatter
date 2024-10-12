// vite-project/src/lib/api_client.js
import axios from 'axios';



const apiclient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true, // Ensure cookies are sent with each request
});

export default apiclient;