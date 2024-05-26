import { strings } from "@strings";
import api from "./api";

// Example for handling normal API request
export const fetchCountryList = async () => {
  try {
    const response = await api.get("/country");
    return response.data;
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

// Example for handling API request with body data
export const createUser = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    toast.success(response.data.message ?? strings.createUserSuccess);
    return response;
  } catch (error) {
    toast.error(error.message ?? strings.createUserError);
    throw error;
  }
};

export const userLogin = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    localStorage.setItem("userDetail", JSON.stringify(response.data.data));
    toast.success(response?.data?.message ?? strings.loginSuccess);
    return response.data;
  } catch (error) {
    toast.error(error.message ?? strings.loginError);
    throw error;
  }
};
// // Example for handling FormData
// export const uploadFile = async (file) => {
//   const formData = new FormData();
//   formData.append("file", file);

//   try {
//     const response = await api.post("/upload", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     throw error;
//   }
// };
