import "src/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "src/context/authContext";
import RouteGuard from "@components/routeGuard";
export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <RouteGuard>
        <NextUIProvider>
          <Toaster />
          <Component {...pageProps} />
        </NextUIProvider>
      </RouteGuard>
    </AuthProvider>
  );
}
