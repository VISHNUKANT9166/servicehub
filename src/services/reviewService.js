import api from "./api";


// =====================================================
// CREATE REVIEW
// =====================================================

export const createReview = async (
    bookingId,
    rating,
    comment
) => {
    const response = await api.post(
        "/reviews",
        {
            bookingId,
            rating,
            comment,
        }
    );

    return response.data;
};


// =====================================================
// GET MY REVIEW FOR A BOOKING
// =====================================================

export const getMyBookingReview = async (
    bookingId
) => {
    const response = await api.get(
        `/reviews/booking/${bookingId}`
    );

    return response.data;
};


// =====================================================
// GET SERVICE REVIEWS
// =====================================================

export const getServiceReviews = async (
    serviceId
) => {
    const response = await api.get(
        `/reviews/service/${serviceId}`
    );

    return response.data;
};


// =====================================================
// GET PROFESSIONAL REVIEWS
// =====================================================

export const getProfessionalReviews = async (
    professionalId
) => {
    const response = await api.get(
        `/reviews/professional/${professionalId}`
    );

    return response.data;
};