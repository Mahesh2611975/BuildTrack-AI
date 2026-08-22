import api from "./api";

// Get all tasks
export const getTasks = () => {
    return api.get("/tasks/");
};

// Create task
export const createTask = (data) => {
    return api.post("/tasks/", data);
};

// Update task
export const updateTask = (taskId, data) => {
    return api.put(`/tasks/${taskId}`, data);
};

// Delete task
export const deleteTask = (taskId) => {
    return api.delete(`/tasks/${taskId}`);
};

// Get tasks by project
export const getTasksByProject = (projectId) => {
    return api.get(`/tasks/project/${projectId}`);
};

// Get tasks by employee
export const getTasksByEmployee = (employeeId) => {
    return api.get(`/tasks/employee/${employeeId}`);
};

// Get tasks by status
export const getTasksByStatus = (status) => {
    return api.get(`/tasks/status/${status}`);
};