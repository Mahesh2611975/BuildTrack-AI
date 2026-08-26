import api from "./api";

// ==========================================================
// MAIN ADVANCES
// ==========================================================

// Get all advances
export const getAdvances = () => {
    return api.get("/advances/");
};

// Get advance by ID
export const getAdvanceById = (advanceId) => {
    return api.get(`/advances/${advanceId}`);
};

// Get advances by employee
export const getAdvancesByEmployee = (employeeId) => {
    return api.get(`/advances/employee/${employeeId}`);
};

// Create advance
export const createAdvance = (data) => {
    return api.post("/advances/", data);
};

// Update advance
export const updateAdvance = (advanceId, data) => {
    return api.put(`/advances/${advanceId}`, data);
};

// Delete advance
export const deleteAdvance = (advanceId) => {
    return api.delete(`/advances/${advanceId}`);
};


// ==========================================================
// DAILY ADVANCE TRANSACTIONS
// ==========================================================

// Get all daily transactions
export const getAdvanceTransactions = () => {
    return api.get("/advance-transactions/");
};

// Get transactions by employee
export const getAdvanceTransactionsByEmployee = (
    employeeId
) => {
    return api.get(
        `/advance-transactions/employee/${employeeId}`
    );
};

// Get transactions by main advance
export const getAdvanceTransactionsByAdvance = (
    advanceId
) => {
    return api.get(
        `/advance-transactions/advance/${advanceId}`
    );
};

// Create daily advance transaction
export const createAdvanceTransaction = (data) => {
    return api.post(
        "/advance-transactions/",
        data
    );
};

// Delete daily advance transaction
export const deleteAdvanceTransaction = (
    transactionId
) => {
    return api.delete(
        `/advance-transactions/${transactionId}`
    );
};