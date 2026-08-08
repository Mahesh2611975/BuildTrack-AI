import api from "./api";

// Get all employees
export const getEmployees = () => {
    return api.get("/employees");
};

// Create employee
export const createEmployee = (data) => {
    return api.post("/employees", data);
};

// Update employee
export const updateEmployee = (id, data) => {
    return api.put(`/employees/${id}`, data);
};

// Delete employee
export const deleteEmployee = async (id) => {
    console.log("DELETE EMPLOYEE:", id);

    const response = await api.delete(
        `/employees/${id}`
    );

    console.log(
        "DELETE EMPLOYEE RESPONSE:",
        response
    );

    return response;
};