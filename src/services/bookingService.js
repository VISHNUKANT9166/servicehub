import api from "./api";


// =====================================================
// GET MY BOOKINGS
// =====================================================

export const getMyBookings = async () => {
    const response =
        await api.get("/bookings");

    return response.data;
};


// =====================================================
// GET BOOKING STATS
// =====================================================

export const getBookingStats = async () => {
    const response =
        await api.get("/bookings/stats");

    return response.data;
};


// =====================================================
// CREATE BOOKING
// =====================================================

export const createBooking = async (
    bookingData
) => {
    const response =
        await api.post(
            "/bookings",
            bookingData
        );

    return response.data;
};


// =====================================================
// CANCEL BOOKING
// =====================================================

export const cancelBooking = async (
    bookingId
) => {
    const response =
        await api.put(
            `/bookings/${bookingId}/cancel`
        );

    return response.data;
};


// =====================================================
// RESCHEDULE BOOKING
// =====================================================

export const rescheduleBooking = async (
    bookingId,
    bookingData
) => {
    const response =
        await api.put(
            `/bookings/${bookingId}/reschedule`,
            bookingData
        );

    return response.data;
};

// =====================================================
// GET PROFESSIONAL BOOKING STATS
// =====================================================

export const getProfessionalBookingStats = async () => {
    const response =
        await api.get(
            "/bookings/professional/stats"
        );

    return response.data;
};


// =====================================================
// GET PROFESSIONAL BOOKINGS
// =====================================================

export const getProfessionalBookings = async () => {
    const response =
        await api.get(
            "/bookings/professional"
        );

    return response.data;
};

// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

export const updateBookingStatus = async (
    bookingId,
    status
) => {
    const response =
        await api.patch(
            `/bookings/${bookingId}/status`,
            { status }
        );

    return response.data;
};