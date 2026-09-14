import api from "./api";


// =====================================================
// GET ADMIN DASHBOARD STATISTICS
// =====================================================

export const getAdminDashboardStats = async () => {

    const response = await api.get(
        "/admin/dashboard/stats"
    );

    return response.data;
};


// =====================================================
// GET PROFESSIONAL APPLICATIONS
// =====================================================

export const getProfessionalApplications = async (
    status = "",
    page = 1,
    limit = 10
) => {

    const params = {
        page,
        limit,
    };


    if (status) {
        params.status = status;
    }


    const response = await api.get(
        "/admin/professionals",
        {
            params,
        }
    );


    return response.data;
};


// =====================================================
// GET SINGLE PROFESSIONAL APPLICATION
// =====================================================

export const getProfessionalApplicationById = async (
    applicationId
) => {

    const response = await api.get(
        `/admin/professionals/${applicationId}`
    );


    return response.data;
};


// =====================================================
// APPROVE PROFESSIONAL APPLICATION
// =====================================================

export const approveProfessionalApplication = async (
    applicationId
) => {

    const response = await api.patch(
        `/admin/professionals/${applicationId}/approve`
    );


    return response.data;
};


// =====================================================
// REJECT PROFESSIONAL APPLICATION
// =====================================================

export const rejectProfessionalApplication = async (
    applicationId,
    rejectionReason
) => {

    const response = await api.patch(
        `/admin/professionals/${applicationId}/reject`,
        {
            rejectionReason,
        }
    );


    return response.data;
};