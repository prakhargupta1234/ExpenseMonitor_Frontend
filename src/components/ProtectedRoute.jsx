import { Navigate, Outlet } from "react-router-dom";
import useUser from "../hooks/useUser";
import { LoaderCircle } from "lucide-react";

const ProtectedRoute = () => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoaderCircle className="animate-spin h-12 w-12" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
