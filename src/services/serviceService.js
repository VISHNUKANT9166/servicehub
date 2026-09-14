import api from "./api";

// Get all active services
export const getAllServices = async () => {
    const response = await api.get("/services");
    return response.data;
};

// Get services of logged-in professional
export const getMyServices = async () => {
    const response = await api.get("/services/my");
    return response.data;
};

// Create a new service
export const createService = async (serviceData) => {
    const response = await api.post("/services", serviceData);
    return response.data;
};

// Update service
export const updateService = async (serviceId, serviceData) => {
    const response = await api.put(
        `/services/${serviceId}`,
        serviceData
    );
    return response.data;
};

// Delete service
export const deleteService = async (serviceId) => {
    const response = await api.delete(
        `/services/${serviceId}`
    );
    return response.data;
};
// Get service by ID
export const getServiceById = async (serviceId) => {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
};
// =====================================================
// TOGGLE SERVICE STATUS
// PATCH /api/services/:id/status
// Protected - Professional
// =====================================================

export const toggleServiceStatus = async (
    serviceId,
    isActive
) => {
    const response = await api.patch(
        `/services/${serviceId}/status`,
        {
            isActive,
        }
    );

    return response.data;
};