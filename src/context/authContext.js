import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getAuthToken } from "src/utils/auth";
import { route } from "@constants/route";

const defaultProvider = {
  user: null,
  loading: true,
  googleUserData: null,
  setGoogleUserData: () => null,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};

const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [googleUserData, setGoogleUserData] = useState(
    defaultProvider.googleUserData
  );
  const router = useRouter();

  const checkLoginSuccess = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        process.env.API_URL + "/auth/login/success",
        { withCredentials: true }
      );

      if (!response?.data?.data?.isVerified) {
        setGoogleUserData(response.data.data);
        router.push(route.register);
      }
      if (response?.data?.data?.isVerified) {
        setLoading(false);
        setUser(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      verifyToken();
      router.replace(route.login);
    }
  };
  const removeLocalStorageData = async () => {
    setUser(null);
    setGoogleUserData(null);
    router.push(route.login);
  };
  const verifyToken = async () => {
    const storedToken = getAuthToken();
    try {
      if (storedToken) {
        setLoading(true);
        const response = await axios
          .get(process.env.API_URL + "/api/verify-token", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          })
          .then(async (res) => {
            // console.log("verify token res->", res);
            let responseData = res.data.data;
            setLoading(false);
            setUser({
              ...responseData,
            });
          })
          .catch((e) => {
            // console.log("verify token error -->", error);
            setLoading(false);
            removeLocalStorageData();
          });
      } else {
        removeLocalStorageData();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      removeLocalStorageData();
    }
  };

  useEffect(() => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      checkLoginSuccess();
    } else {
      verifyToken();
    }
  }, []);

  const handleLogin = async (params) => {
    try {
      // const response = await axios.post(
      //   process.env.API_URL + "/api/login",
      //   params
      // );
      const response = await userLogin(params);
      // console.log("handle login response -->", response.data);
      if (response.data.status) {
        // setAuthToken(response.data.data.token); // Save token to localStorage
        setUser(response.data.data); // Set user in context
        localStorage.setItem("userDetail", JSON.stringify(response.data.data));
        setLoading(false);
        router.push(route.dashboard);
      }
    } catch (error) {
      // console.log("Login error:", error);
    }
  };

  const handleLogout = async () => {
    setUser(null);
    setLoading(false);
    setGoogleUserData(null);
    localStorage.removeItem("userDetail");
    router.push(route.login);
  };

  const values = {
    user,
    loading,
    googleUserData,
    setGoogleUserData,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
