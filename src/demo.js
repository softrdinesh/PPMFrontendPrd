import { Loader } from "@components/Loader/Loader";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { AuthContext } from "src/context/authContext";
import { getUserDetail } from "src/utils/auth";

export default function AuthGuard(props) {
  const { user, loading, login } = useContext(AuthContext);
  console.log("AuthGuard detail loading ->", loading);
  console.log("AuthGuard detail user ->", user);
  // console.log("AuthGuard detail login ->", login);

  const { children } = props;
  const router = useRouter();
  useEffect(
    () => {
      console.log("1");
      if (!router.isReady) {
        console.log("2");
        return;
      }
      if (user == null && !window.localStorage.getItem("userDetail")) {
        console.log("3");
        if (router.asPath !== "/") {
          console.log("4");
          router.replace({
            pathname: "/login",
            query: { returnUrl: router.asPath },
          });
        } else {
          console.log("5");
          router.replace("/login");
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  );
  if (loading || user == null || router.asPath == "/login") {
    console.log("6");

    return <Loader />;
  }

  return <>{children}</>;
}
