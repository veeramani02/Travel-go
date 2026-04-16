import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { PacmanLoader } from "react-spinners";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="loading-container">
        <PacmanLoader color="#1e40af" size={25} />
      </div>
    );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
