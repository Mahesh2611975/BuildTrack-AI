import api from "./api";

export const getContractors = () => {
    return api.get("/contractors");
};

export const createContractor = (data) => {
    return api.post("/contractors", data);
};

export const updateContractor = (id, data) => {
    return api.put(`/contractors/${id}`, data);
};

export const deleteContractor = (id) => {
    return api.delete(`/contractors/${id}`);
};