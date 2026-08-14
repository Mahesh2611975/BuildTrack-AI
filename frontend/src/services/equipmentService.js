import api from "./api";

// ==========================================================
// GET ALL EQUIPMENT
// ==========================================================

export const getEquipment = () => {
    return api.get("/equipment/");
};

// ==========================================================
// GET EQUIPMENT BY ID
// ==========================================================

export const getEquipmentById = (id) => {
    return api.get(`/equipment/${id}`);
};

// ==========================================================
// CREATE EQUIPMENT
// ==========================================================

export const createEquipment = (data) => {
    return api.post("/equipment/", data);
};

// ==========================================================
// UPDATE EQUIPMENT
// ==========================================================

export const updateEquipment = (id, data) => {
    return api.put(`/equipment/${id}`, data);
};

// ==========================================================
// DELETE EQUIPMENT
// ==========================================================

export const deleteEquipment = (id) => {
    return api.delete(`/equipment/${id}`);
};