const envBaseURL = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const productionFallbackBaseURL = "https://api.writers24.net";
const baseURL = envBaseURL || (import.meta.env.PROD ? productionFallbackBaseURL : "");
export { baseURL };
