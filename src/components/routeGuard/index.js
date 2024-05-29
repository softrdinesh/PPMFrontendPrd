import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { Loader } from "@components/Loader/Loader";
import { route } from "@constants/route";
import { AuthContext } from "src/context/authContext";

const RouteGuard = ({ children }) => {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (!user && router.pathname.startsWith(route.dashboard)) {
        router.push(route.login);
      } else if (
        user &&
        (router.pathname === route.login || router.pathname === route.register)
      ) {
        router.push(route.dashboard);
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return <Loader />;
  }

  return children;
};

export default RouteGuard;
