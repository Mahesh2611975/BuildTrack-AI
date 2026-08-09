import api from "./api";

// Generate payroll for an employee
export const getPayroll = (employeeId, year, month) => {
    return api.get(
        `/payroll/${employeeId}/${year}/${month}`
    );
};