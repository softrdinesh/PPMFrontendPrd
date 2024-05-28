// ** React Imports
import { createContext, useEffect, useState } from "react";

// ** Next Import
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import axios from "axios";
import { route } from "@constants/route";
import { getAuthToken, getUserDetail } from "src/utils/auth";

// ** Config

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
};
const AuthContext = createContext(defaultProvider);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defaultProvider.user);
  const [loading, setLoading] = useState(defaultProvider.loading);
  const [recallApi, setRecallApi] = useState("");

  // ** Hooks
  const router = useRouter();

  const removeLocalStorageData = async () => {
    localStorage.removeItem("userDetail");
    router.push("/login");
  };
  const checkLoginSuccess = async () => {
    console.log("2");
    setLoading(true);
    try {
      const response = await axios.get(
        process.env.API_URL + "/auth/login/success",
        { withCredentials: true }
      );
      if (response?.data?.status) {
        //   toast.success(response?.data?.message);
        console.log("auth login sucess->>", response?.data);
        if (!response?.data?.data?.isVerified) {
          router.push(route.register);
        }
        //
        setUser(response?.data?.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      verifyToken();
      console.log("error :", error);
      router.replace("/login");
    }
  };
  const verifyToken = async () => {
    const storedToken = getAuthToken();

    console.log("1");
    try {
      if (storedToken != null) {
        // verify token api
        setLoading(true);
        await axios
          .get(process.env.API_URL + "/api/verify-token", {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${storedToken}`,
            },
          })
          .then(async (res) => {
            console.log("@@@@@->", res);
            let responseData = res.data.userData;
            console.log("verify token res @@ ->", res.data.userData);
            setLoading(false);
            setUser({
              ...responseData,
            });
          })
          .catch((e) => {
            console.log("verify token error -->", error);
            setLoading(false);
            //   handleLogout()
          });
      } else {
        console.log("3");
        removeLocalStorageData();
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.log("verify token error->", error);

      setLoading(false);
    }
  };
  useEffect(() => {
    const storedToken = getAuthToken();
    console.log("storedToken !!=>", storedToken);

    if (storedToken == null) {
      checkLoginSuccess();
    } else {
      verifyToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recallApi]);

  const handleLogin = async (params, errorCallback) => {};

  const handleLogout = async () => {
    setUser(null);
    setLoading(false);
    window.localStorage.removeItem("userDetail");
    router.push("/login");
  };

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
