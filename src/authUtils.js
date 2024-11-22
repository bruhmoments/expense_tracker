import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);  // Use jwtDecode instead of jwt_decode
    return decoded.exp * 1000 < Date.now();  // Expiration is in seconds, compare to current time in ms
  } catch (error) {
    return true;  // Invalid token
  }
};

export const getToken = () => localStorage.getItem('token');  // Assuming you store the JWT token in localStorage

export const isAuthenticated = () => {
  const token = getToken();
  return !isTokenExpired(token);
};
