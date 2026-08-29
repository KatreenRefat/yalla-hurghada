import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // احفظ الـ path عشان ترجعله بعد اللوجن
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}