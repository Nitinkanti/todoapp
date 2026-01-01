import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Ye component check karega ki user logged in hai ya nahi
// Agar logged in nahi, to redirect to /login
function PrivateRoutes() {
  const { user } = useContext(AuthContext);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoutes;
