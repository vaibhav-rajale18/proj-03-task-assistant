import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if token exists in localStorage
  const token = localStorage.getItem("token");

  // If token exists, render children; otherwise redirect to /login
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
