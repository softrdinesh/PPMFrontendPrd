import "src/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "src/context/authContext";
import AuthGuard from "@components/authGuard";
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AuthGuard>
        <NextUIProvider>
          <Toaster />
          <Component {...pageProps} />
        </NextUIProvider>
      </AuthGuard>
    </AuthProvider>
  );
}
