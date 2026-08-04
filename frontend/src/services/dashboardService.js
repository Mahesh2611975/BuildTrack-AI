import api from "./api";

export const getDashboardSummary = async () => {
    const response = await api.get("/dashboard/project-summary");
    return response.data;
};