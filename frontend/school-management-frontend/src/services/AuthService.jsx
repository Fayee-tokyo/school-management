// src/services/authService.js

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

/**
 * Base URL for your backend API auth endpoints
 */
const API_URL = 'http://localhost:5293/api/auth';

/**
 * Key under which the JWT is stored in localStorage
 */
const TOKEN_KEY = 'token';

/**
 * Register a new user.
 * @param {{ firstName, lastName, email, password, phone, role }} userData
 * @returns {Promise<*>} The API response (e.g., { message: "User registered successfully!" })
 */
export async function register(userData) {
  const response = await axios.post(
    `${API_URL}/register`,
    userData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return response.data;
}

/**
 * Log in with email + password.
 * On success, stores the JWT in localStorage and returns the decoded payload.
 * @param {{ email, password }} credentials
 * @returns {Promise<{ token: string, decoded: object }>}
 */
export async function login(credentials) {
  const response = await axios.post(
    `${API_URL}/login`,
    credentials,
    { headers: { 'Content-Type': 'application/json' } }
  );

  const token = response.data.token || response.data.Token;
  if (!token) {
    throw new Error('No token returned from server');
  }

  localStorage.setItem(TOKEN_KEY, token);

  const decoded = jwtDecode(token);
  return { token, decoded };
}

/**
 * Remove the JWT from localStorage.
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Retrieve the raw JWT string from localStorage (or null if none).
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Decode the token payload and return it (or null if invalid/missing).
 * @returns {object|null}
 */
export function getDecodedToken() {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

/**
 * Return the user’s primary role (or null if not logged in).
 * If the backend encoded roles as an array, returns the first element.
 * Adjust if you store multiple roles and want all of them.
 * @returns {string|null}
 */
export function getUserRole() {
  const decoded = getDecodedToken();
  if (!decoded) return null;

  const claimUri = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  if (decoded[claimUri]) {
    const claimVal = decoded[claimUri];
    return Array.isArray(claimVal) ? claimVal[0] : claimVal;
  }

  if (Array.isArray(decoded.role)) {
    return decoded.role[0] || null;
  }

  return decoded.role || null;
}

/**
 * Return true if there is a non-expired token in localStorage.
 * Checks the “exp” field in the decoded JWT.
 * @returns {boolean}
 */
export function isLoggedIn() {
  const decoded = getDecodedToken();
  if (!decoded || !decoded.exp) return false;
  return decoded.exp > Date.now() / 1000;
}

/**
 * Return an authorization header object for protected requests.
 * Adds both Authorization and Content-Type headers.
 * @returns {{ Authorization: string, 'Content-Type': string }}
 */
export function authHeader() {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}
