import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { auth } from "../utils/firebaseConfig"; // Import your firebase auth configuration

interface PrivateRouteProps extends RouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  // Check if the user is authenticated
  const user = auth.currentUser;

  // If the user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the component
  return <>{element}</>;
};

export default PrivateRoute;
