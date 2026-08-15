import api from "./api";

// ==========================================================
// GET ALL EXPENSES
// ==========================================================

export const getExpenses = () => {
    return api.get("/expenses/");
};

// ==========================================================
// GET EXPENSE BY ID
// ==========================================================

export const getExpenseById = (id) => {
    return api.get(`/expenses/${id}`);
};

// ==========================================================
// GET EXPENSES BY PROJECT
// ==========================================================

export const getExpensesByProject = (projectId) => {
    return api.get(`/expenses/project/${projectId}`);
};

// ==========================================================
// CREATE EXPENSE
// ==========================================================

export const createExpense = (data) => {
    return api.post("/expenses/", data);
};

// ==========================================================
// UPDATE EXPENSE
// ==========================================================

export const updateExpense = (id, data) => {
    return api.put(`/expenses/${id}`, data);
};

// ==========================================================
// DELETE EXPENSE
// ==========================================================

export const deleteExpense = (id) => {
    return api.delete(`/expenses/${id}`);
};