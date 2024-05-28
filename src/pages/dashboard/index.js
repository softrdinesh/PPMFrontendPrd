/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function index() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // const getUser = async () => {
  //   try {
  //     const response = await axios.get(
  //       process.env.API_URL + "/auth/login/success",
  //       { withCredentials: true }
  //     );
  //     if (response?.data?.status) {
  //       toast.success(response?.data?.message);
  //       console.log("auth login sucess->>", response?.data);

  //       setData(response?.data?.data);
  //       setIsLoading(false);
  //     }
  //   } catch (error) {
  //     console.log("error :", error?.response?.data);
  //     router.replace("/");
  //   }
  // };

  // const handleLogout = async () => {
  //   try {
  //     window.open(`${process.env.API_URL}/auth/logout`, "_self");

  //     console.log("auth logout", response?.data);
  //   } catch (error) {
  //     console.log("error :", error?.response?.data);
  //   }
  // };

  useEffect(() => {
    // getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);
  return <div className="bg-primary"></div>;
}
