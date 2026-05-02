import axios from "axios";
import { BASE_URL } from "./apiEndPoints";

const axiosConfig = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }


});

//list of end points do not require authorization header
const excludePaths = ["/login", "/register", "/status", "/activate", "/health"]

//request interceptor
axiosConfig.interceptors.request.use((config) => {
    const requestUrl = config.url || "";
    const shouldSkipToken = excludePaths.some((endpoint) => {
        return config.url?.includes(endpoint);
    });

    if (!shouldSkipToken) {
        const access = localStorage.getItem("token");
        if (access) {
            config.headers["Authorization"] = `Bearer ${access}`;
        }
    }
    return config;
},
    (error) => {
        return Promise.reject(error)
    });



//response interceptor 
axiosConfig.interceptors.response.use((response) => {
    return response;
},
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error Please try again later:", error.response.data);
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again later.");
        }
        return Promise.reject(error);
    })

export default axiosConfig;