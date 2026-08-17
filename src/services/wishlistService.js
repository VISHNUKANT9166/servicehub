import api from "./api";

// Get current user's wishlist
export const getWishlist = async () => {
    const response = await api.get("/wishlist");
    return response.data;
};

// Add service to wishlist
export const addToWishlist = async (serviceId) => {
    const response = await api.post(`/wishlist/${serviceId}`);
    return response.data;
};

// Remove service from wishlist
export const removeFromWishlist = async (serviceId) => {
    const response = await api.delete(`/wishlist/${serviceId}`);
    return response.data;
};