import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import PrivateRoutes from "./PrivateRoutes.jsx";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Private routes */}
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
