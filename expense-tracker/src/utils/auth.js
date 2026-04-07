export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const setUserData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
};

export const getUser = () => {
  // First try to get explicitly set user data
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Failed to parse stored user", e);
  }

  // Fallback to token
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const paddedBase64 = pad ? base64 + '='.repeat(4 - pad) : base64;
    
    // Decode base64 and handle UTF-8
    const decodedStr = decodeURIComponent(
      atob(paddedBase64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    const decoded = JSON.parse(decodedStr);
    
    return { name: decoded.name || 'User', email: decoded.sub || '' };
  } catch (e) {
    console.error("Failed to decode token", e);
    return null;
  }
};

export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
