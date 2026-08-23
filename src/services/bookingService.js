import api from "./api";

// Get bookings of logged-in user
export const getMyBookings = async () => {
    const response = await api.get("/bookings");

    return response.data;
};
// Get booking statistics of logged-in user
export const getBookingStats = async () => {
    const response = await api.get("/bookings/stats");

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
// Cancel a booking
export const cancelBooking = async (bookingId) => {
    const response = await api.put(
        `/bookings/${bookingId}/cancel`
    );

    return response.data;
};
// Reschedule an existing booking
export const rescheduleBooking = async (
    id,
    bookingData
) => {
    const response = await api.put(
        `/bookings/${id}/reschedule`,
        bookingData
    );

    return response.data;
};