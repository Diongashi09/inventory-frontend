import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL, // Your Laravel API base URL
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json', // Often useful for POST/PUT requests
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // If a token exists, attach it to the Authorization header
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export function useAxios(){
  return {
    api
  }
}

// const api = axios.create({
//   baseURL: 'http://localhost:8000/api', 
//   headers: {
//     Accept: 'application/json',
//   },
// })

// Optional: Add an interceptor for handling common errors or refreshing tokens

// api.interceptors.response.use(
//   response => response,
//   error => {
//     // Example: Handle 401 Unauthorized globally
//     if (error.response && error.response.status === 401) {
//       // You might want to clear session and redirect to login
//       // const auth = useAuth(); // This would cause circular dependency
//       // Instead, dispatch an event or use a global error handler
//       console.error('Unauthorized, redirecting to login...', error.response.data);
//       // For a simple app, a direct redirect might be acceptable if not in a critical path
//       // window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api