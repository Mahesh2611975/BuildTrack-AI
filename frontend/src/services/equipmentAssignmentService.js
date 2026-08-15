import api from "./api";


// ==========================================================
// GET ALL ASSIGNMENTS
// ==========================================================

export const getEquipmentAssignments = () => {
    return api.get("/equipment-assignments/");
};


// ==========================================================
// CREATE ASSIGNMENT
// ==========================================================

export const createEquipmentAssignment = (data) => {
    return api.post(
        "/equipment-assignments/",
        data
    );
};


// ==========================================================
// UPDATE ASSIGNMENT
// ==========================================================

export const updateEquipmentAssignment = (
    id,
    data
) => {
    return api.put(
        `/equipment-assignments/${id}`,
        data
    );
};