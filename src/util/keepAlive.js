import axiosConfig from "./axiosConfig";
import { API_ENDPOINTS } from "./apiEndpoints";

/**
 * KeepAlive Utility
 * 
 * This utility sends a periodic ping to the backend server to prevent it from 
 * spinning down due to inactivity (common on Render free tier).
 * 
 * To disable this feature:
 * 1. Comment out the call to 'startKeepAlive()' in src/main.jsx
 * 2. Or simply delete this file.
 */

let intervalId = null;

export const startKeepAlive = (intervalMinutes = 5) => {
    if (intervalId) return;

    console.log(`[KeepAlive] Starting server heartbeat (every ${intervalMinutes} minutes)...`);

    const pingServer = async () => {
        try {
            await axiosConfig.get(API_ENDPOINTS.HEALTH);
            console.log(`[KeepAlive] Server ping successful: ${new Date().toLocaleTimeString()}`);
        } catch (error) {
            console.warn(`[KeepAlive] Server ping failed: ${error.message}`);
        }
    };

    // Initial ping
    pingServer();

    // Set interval
    intervalId = setInterval(pingServer, intervalMinutes * 60 * 1000);
};

export const stopKeepAlive = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log("[KeepAlive] Server heartbeat stopped.");
    }
};
