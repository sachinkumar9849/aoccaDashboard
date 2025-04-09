// // src/lib/axios.ts

// import axios from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_URL || 'http://156.67.104.182:8081/api/v1';

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // Get token from localStorage
//     const token = localStorage.getItem('authToken');
    
//     // If token exists, add to headers
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Handle 401 unauthorized errors
//     if (error.response && error.response.status === 401) {
//       // Clear local storage
//       localStorage.removeItem('authToken');
//       localStorage.removeItem('user');
      
//       // Redirect to login page (using window.location in interceptor since we're outside React context)
//       window.location.href = '/signin';
//     }
    
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;