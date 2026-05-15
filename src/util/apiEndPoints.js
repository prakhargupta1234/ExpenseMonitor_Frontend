//export const BASE_URL = "http://localhost:8080/api/v1.0";
export const BASE_URL = "https://expensemonitor-backend.onrender.com/api/v1.0";

const CLOUDINARY_CLOUD_NAME = "dncoknrf7";

export const API_ENDPOINTS = {
    LOGIN: "/login",
    REGISTER: "/register",
    ACTIVATE: "/activate",
    GET_USER_INFO: "/profile",
    GET_ALL_CATEGORIES: "/categories",
    ADD_CATEGORY: "/categories",
    UPDATE_CATEGORY: (categoryId) => `/categories/${categoryId}`,
    GET_ALL_EARNINGS: "/incomes",
    CATEGORY_BY_TYPE: (type) => `/categories/${type}`,
    ADD_EARNING: "/incomes",
    DELETE_EARNING: (incomeId) => `/incomes/${incomeId}`,
    EARNINGS_EXCEL_DOWNLOAD: "/excel/download/income",
    EMAIL_EARNINGS: "/email/income-excel",
    GET_ALL_SPENDINGS: "/expences",
    ADD_SPENDING: "/expences",
    DELETE_SPENDING: (expenseId) => `/expences/${expenseId}`,
    SPENDINGS_EXCEL_DOWNLOAD: "/excel/download/expense",
    EMAIL_SPENDINGS: "/email/expense-excel",
    APPLY_FILTERS: "/filter",
    DASHBOARD_DATA: "/dashboard",
    UPLOAD_IMAGE: `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    HEALTH: "/health"
}