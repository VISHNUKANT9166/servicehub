import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProfessionalRoute({ children }) {

    const {
        user,
        authLoading,
    } = useAuth();


    // =====================================================
    // WAIT FOR AUTHENTICATION
    // =====================================================

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4">
                    </div>

                    <p className="text-gray-600">
                        Checking authentication...
                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    // =====================================================
    // NOT A PROFESSIONAL
    // =====================================================

    if (user.role !== "professional") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    // =====================================================
    // PROFESSIONAL
    // =====================================================

    return children;
}

export default ProfessionalRoute;