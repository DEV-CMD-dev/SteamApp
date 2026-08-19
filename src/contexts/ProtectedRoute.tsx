import { useContext, useEffect, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { expirationTime, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!expirationTime || new Date(expirationTime).getTime() <= Date.now()) {
            logout();
            navigate("/auth");
        }
    }, [expirationTime, logout, navigate]);

    if (!expirationTime || new Date(expirationTime).getTime() <= Date.now()) {
        return null;
    }

    return children;
};