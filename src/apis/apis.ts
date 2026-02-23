import axios from "axios";

//instance with the base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
});


apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const apiRequest = async (method, url, data = {}, options = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...options,
    });
    return response.data;
  } catch (error:any) {
   
    const message = error.response?.data?.message || "Something went wrong";
    console.error(`API Error [${url}]:`, message);
    throw error; 
  }
};

export default apiClient;









//  Request Interceptor 





// // Response Interceptor for global error handling
// apiClient.interceptors.response.use(
//   (response) => response, 
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Clear data and boot user to login
//       if (typeof window !== 'undefined') {
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//         window.location.href = '/login?error=session_expired';
//       }
//     }
//     return Promise.reject(error);
//   }
// );
