// export const BASE_URL = "https://expensemonitor-backend.onrender.com/api/v1.0";
export const BASE_URL = "http://localhost:8080/api/v1.0";

const CLOUDINARY_CLOUD_NAME ="dncoknrf7";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    GET_USER_INFO:"/profile",

    // Category endpoints
    GET_ALL_CATEGORIES: "/categories",
    CATEGORY_BY_TYPE: (type) => `/categories/${type.toLowerCase()}`,
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,

    // Dashboard endpoint
    DASHBOARD: "/dashboard",

    // Income endpoints
    GET_ALL_INCOMES: "/incomes",
    CREATE_INCOME: "/incomes",
    DELETE_INCOME: "/incomes", // append /{id}

    // Expense endpoints
    GET_EXPENSES: "/expences",
    CREATE_EXPENSE: "/expences",
    DELETE_EXPENSE: "/expences", // append /{id}

    // Filter endpoint
    FILTER: "/filter",

    // Health check
    HEALTH: "/status",

    // Cloudinary
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
}
