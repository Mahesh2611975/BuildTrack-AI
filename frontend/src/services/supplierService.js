import api from "./api";

// Get all suppliers
export const getSuppliers = () => {
    return api.get("/suppliers/");
};

// Create supplier
export const createSupplier = (data) => {
    return api.post("/suppliers/", data);
};

// Update supplier
export const updateSupplier = (supplierId, data) => {
    return api.put(`/suppliers/${supplierId}`, data);
};

// Delete supplier
export const deleteSupplier = (supplierId) => {
    return api.delete(`/suppliers/${supplierId}`);
};