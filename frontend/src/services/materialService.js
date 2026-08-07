import api from "./api";

export const getMaterials = () => {
    return api.get("/materials");
};

export const createMaterial = (data) => {
    return api.post("/materials", data);
};

export const updateMaterial = (id, data) => {
    return api.put(`/materials/${id}`, data);
};

export const deleteMaterial = (id) => {
    return api.delete(`/materials/${id}`);
};