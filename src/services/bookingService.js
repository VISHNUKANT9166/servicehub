import api from "./api";

// Get bookings of logged-in user
export const getMyBookings = async () => {
    const response = await api.get("/bookings");

    return response.data;
};

// Create a new booking
export const createBooking = async (bookingData) => {
    const response = await api.post(
        "/bookings",
        bookingData
    );

    return response.data;
};