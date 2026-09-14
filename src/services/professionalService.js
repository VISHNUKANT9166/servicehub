import api from "./api";


// =====================================================
// CREATE PROFESSIONAL PROFILE
// =====================================================

export const createProfessionalProfile = async (
    professionalData
) => {

    const response = await api.post(
        "/professionals",
        professionalData
    );

    return response.data;
};


// =====================================================
// GET MY PROFESSIONAL PROFILE
// =====================================================

export const getMyProfessionalProfile = async () => {

    const response = await api.get(
        "/professionals/me"
    );

    return response.data;
};


// =====================================================
// UPDATE MY PROFESSIONAL PROFILE
// =====================================================

export const updateMyProfessionalProfile = async (
    professionalData
) => {

    const response = await api.put(
        "/professionals/me",
        professionalData
    );

    return response.data;
};