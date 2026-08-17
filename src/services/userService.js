import api from "./api";

// Get current logged-in user
export const getCurrentUser = async () => {
    const response = await api.get("/users/me");

    return response.data;
};

// Update current user's profile
export const updateUserProfile = async (profileData) => {
    const response = await api.put(
        "/users/profile",
        profileData
    );

    return response.data;
};