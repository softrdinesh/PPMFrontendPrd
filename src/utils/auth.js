// Helper function to parse user details from localStorage
const parseUserDetail = () => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("userDetail");
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Function to get user details
export const getUserDetail = () => {
  return parseUserDetail();
};

// Function to get auth token
export const getAuthToken = () => {
  return parseUserDetail()?.token ?? null;
};

// Function to get refresh token
export const getRefreshToken = () => {
  return parseUserDetail()?.refreshToken ?? null;
};

export const isLoggedIn = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("userDetail");
  }
  return false;
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("userDetail");
  }
};
