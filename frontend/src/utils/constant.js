// Use environment variable or fallback to production URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://jobportal-production-2a6b.up.railway.app";

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/api/v1/company`;