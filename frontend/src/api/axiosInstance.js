import axios from 'axios';

// You can adjust this to point to your backend’s base URL.
// If you have a REACT_APP_API_URL in your .env, it will be used; otherwise default to localhost.
//const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const baseURL = process.env.REACT_APP_API_URL || 'https://panisho-project.onrender.com/api';


const api = axios.create({
  baseURL,
  withCredentials: true,  // ← send & receive cookies
  headers: {
    'Content-Type': 'application/json',
  },
});


export default api;
