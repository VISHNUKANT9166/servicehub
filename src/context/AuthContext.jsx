import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/userService";

const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // No token = user is not logged in
        if (!token) {
            setAuthLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();

                if (data.success) {
                    setUser(data.user);

                    // Keep latest verified user data
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );
                }
            } catch (error) {
                console.error("Authentication Error:", error);

                // Token invalid/expired
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );
    };

    const logout = () => {
        setUser(null);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                authLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthProvider;