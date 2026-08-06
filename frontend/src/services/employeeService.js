    import api from "./api";

    export const getEmployees = () => {
        return api.get("/employees");
    };

    export const createEmployee = (data) => {
        return api.post("/employees", data);
    };

    export const updateEmployee = (id, data) => {
        return api.put(`/employees/${id}`, data);
    };

    export const deleteEmployee = (id) => {
        return api.delete(`/employees/${id}`);
    };