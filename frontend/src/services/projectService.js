import api from "./api";

export const getProjects = () => {
    return api.get("/projects");
};

export const createProject = (data) => {
    return api.post("/projects", data);
};

export const updateProject = (id, data) => {
    return api.put(`/projects/${id}`, data);
};

export const deleteProject = (id) => {
    return api.delete(`/projects/${id}`);
};