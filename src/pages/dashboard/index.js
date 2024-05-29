/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { AuthContext } from "src/context/authContext";
import { getUserDetail } from "src/utils/auth";

export default function index() {
  const router = useRouter();
  const { setUser } = useContext(AuthContext);
  const userDetail = getUserDetail();

  return (
    <div className="bg-primary h-[240px]">
      <div className="flex flex-1 bg-primary justify-center items-center  mt-5">
        <p className="text-white">
          Welcome your email id is:
          <span className="font-bold text-white "> {userDetail?.email}</span>
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          type="submit"
          className="text-xl border rounded-md bg-darkRed w-1/2 font-medium text-white text-center items-center mt-4"
          onClick={() => {
            window.localStorage.removeItem("userDetail");
            router.push("/login");
            setUser(null);
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}
