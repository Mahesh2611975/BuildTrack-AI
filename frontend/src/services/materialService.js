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

    export const deleteMaterial = async (id) => {
        console.log("DELETE SERVICE CALLED:", id);

        const response = await api.delete(`/materials/${id}`);

        console.log("DELETE RESPONSE:", response);

        return response;
    };