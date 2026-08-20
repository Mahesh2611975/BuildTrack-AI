import api from "./api";


// ==========================================================
// CREATE DAILY ADVANCE
// ==========================================================

export const createDailyAdvance = async (data) => {

    const response = await api.post(
        "/advance-transactions/",
        data
    );

    return response.data;
};


// ==========================================================
// GET ALL DAILY ADVANCES
// ==========================================================

export const getDailyAdvances = async () => {

    const response = await api.get(
        "/advance-transactions/"
    );

    return response.data;
};


// ==========================================================
// DELETE DAILY ADVANCE
// ==========================================================

export const deleteDailyAdvance = async (
    transactionId
) => {

    const response = await api.delete(
        `/advance-transactions/${transactionId}`
    );

    return response.data;
};