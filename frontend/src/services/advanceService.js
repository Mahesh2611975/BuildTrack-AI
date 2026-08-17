import api from "./api";

// ==========================================================
// GET ALL ADVANCES
// ==========================================================

export const getAdvances = () => {
    return api.get("/advances/");
};

// ==========================================================
// GET ADVANCE BY ID
// ==========================================================

export const getAdvanceById = (id) => {
    return api.get(`/advances/${id}`);
};

// ==========================================================
// GET ADVANCES BY EMPLOYEE
// ==========================================================

export const getAdvancesByEmployee = (employeeId) => {
    return api.get(
        `/advances/employee/${employeeId}`
    );
};

// ==========================================================
// CREATE ADVANCE
// ==========================================================

export const createAdvance = (data) => {
    return api.post("/advances/", data);
};

// ==========================================================
// UPDATE ADVANCE
// ==========================================================

export const updateAdvance = (id, data) => {
    return api.put(
        `/advances/${id}`,
        data
    );
};

// ==========================================================
// DELETE ADVANCE
// ==========================================================

export const deleteAdvance = (id) => {
    return api.delete(
        `/advances/${id}`
    );
};