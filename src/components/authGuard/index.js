import { Loader } from "@components/Loader/Loader";
import React, { useContext } from "react";
import { AuthContext } from "src/context/authContext";

export default function AuthGuard({ children }) {
  const { user, loading, login } = useContext(AuthContext);
  // console.log("AuthGuard detail loading ->", loading);
  // console.log("AuthGuard detail user ->", user);
  // console.log("AuthGuard detail login ->", login);
  if (loading) {
    <Loader />;
  } else {
    return <div>{children}</div>;
  }
}
