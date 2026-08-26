import api from "./api";

// ============================================================
// GENERATE PAYROLL
// ============================================================

export const getPayroll = (employeeId, year, month) => {
    return api.get(
        `/payroll/${employeeId}/${year}/${month}`
    );
};


// ============================================================
// SAVE PAYROLL
// ============================================================

export const savePayroll = (
    employeeId,
    year,
    month
) => {
    return api.post(
        `/payroll/save?employee_id=${employeeId}&year=${year}&month=${month}`
    );
};


// ============================================================
// DOWNLOAD PAYSLIP
// ============================================================

export const downloadPayslip = (
    employeeId,
    year,
    month
) => {
    return api.get(
        `/payroll/${employeeId}/${year}/${month}/payslip`,
        {
            responseType: "blob",
        }
    );
};


// ============================================================
// GET ALL PAYROLL HISTORY
// ============================================================

export const getPayrollHistory = () => {
    return api.get(
        "/payroll-history"
    );
};


// ============================================================
// GET PAYROLL BY ID
// ============================================================

export const getPayrollById = (
    payrollId
) => {
    return api.get(
        `/payroll-history/${payrollId}`
    );
};


// ============================================================
// GET EMPLOYEE PAYROLL HISTORY
// ============================================================

export const getEmployeePayrollHistory = (
    employeeId
) => {
    return api.get(
        `/payroll-history/employee/${employeeId}`
    );
};


// ============================================================
// DELETE PAYROLL
// ============================================================

export const deletePayroll = (
    payrollId
) => {
    return api.delete(
        `/payroll-history/${payrollId}`
    );
};