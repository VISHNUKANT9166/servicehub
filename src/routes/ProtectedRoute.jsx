import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { user, authLoading } = useAuth();

    // Wait until authentication check is complete
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                    <p className="text-gray-600">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }

    // User is not authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User is authenticated
    return children;
}

export default ProtectedRoute;