import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const user = JSON.parse(
        localStorage.getItem("lms_current_user")
    );

    if (!user) {
        return <Navigate to="/users" replace />;
    }

    return children;
}

export default ProtectedRoute;