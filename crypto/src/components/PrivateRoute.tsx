import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { auth } from "../utils/firebaseConfig"; 

interface PrivateRouteProps extends RouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {

  const user = auth.currentUser;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{element}</>;
};

export default PrivateRoute;
