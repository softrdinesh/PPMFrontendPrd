/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/router";
import { AuthContext } from "src/context/authContext";
import { getUserDetail } from "src/utils/auth";
import { route } from "@constants/route";

export default function index() {
  const router = useRouter();
  const { setUser, user } = useContext(AuthContext);
  const userDetail = getUserDetail();
  console.log("user->", user);
  return (
    <div className="bg-primary h-auto py-2">
      <div className="flex flex-1 bg-primary justify-center items-center  mt-5">
        <p className="text-white">
          Welcome your email id is:
          <span className="font-bold text-white ">
            {userDetail?.email ?? user.userData.Email}
          </span>
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          // type="submit"
          className="text-xl border  border-white rounded-md bg-primary w-1/2 font-medium text-white text-center items-center mt-4"
          onClick={() => {
            // window.localStorage.removeItem("userDetail");
            router.push(route.demo);
            // setUser(null);
          }}
        >
          Go To Demo
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          className="text-xl border  border-white rounded-md bg-primary w-1/2 font-medium text-white text-center items-center mt-4"
          onClick={() => {
            router.push(route.inlineRow);
          }}
        >
          Inline Row Example
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          className="text-xl border  border-white rounded-md bg-primary w-1/2 font-medium text-white text-center items-center mt-4"
          onClick={() => {
            router.push(route.inlineCell);
          }}
        >
          Inline Cell Example
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          className="text-xl border  border-white rounded-md bg-primary w-1/2 font-medium text-white text-center items-center mt-4"
          onClick={() => {
            router.push(route.inlineTable);
          }}
        >
          Inline Table Example
        </Button>
      </div>
      <div className="flex justify-center">
        <Button
          className="text-xl border  border-white rounded-md bg-primary w-1/2 font-medium text-white text-center items-center mt-4"
          onClick={() => {
            router.push(route.inlineTree);
          }}
        >
          Inline Tree Table Example
        </Button>
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
