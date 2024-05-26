import { Inter } from "next/font/google";
import Register from "./register";
import Login from "./login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Login />
      {/* <Register /> */}
    </>
  );
}
