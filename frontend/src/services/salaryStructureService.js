import api from "./api";

// Get all salary structures
export const getSalaryStructures = () => {
    return api.get("/salary-structure/");
};

// Create salary structure
export const createSalaryStructure = (data) => {
    return api.post("/salary-structure/", data);
};

// Update salary structure
export const updateSalaryStructure = (employeeId, data) => {
    return api.put(
        `/salary-structure/${employeeId}`,
        data
    );
};