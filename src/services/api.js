import axios from "axios";


// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});


// =====================================================
// REQUEST INTERCEPTOR
// Automatically attach JWT token
// =====================================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("token");


        // =============================================
        // ATTACH JWT TOKEN
        // =============================================

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }


        // =============================================
        // CONTENT TYPE
        // Let Axios automatically handle FormData
        // =============================================

        if (
            config.data instanceof FormData
        ) {

            // Important:
            // Don't manually set multipart/form-data.
            // Axios automatically adds the correct boundary.

            delete config.headers["Content-Type"];

        } else {

            config.headers["Content-Type"] =
                "application/json";
        }


        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


export default api;