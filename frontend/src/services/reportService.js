import api from "./api";

// =====================================================
// EMPLOYEE REPORT
// =====================================================

export const downloadEmployeeReport = (employeeId) => {
    return api.get(
        `/reports/employee/${employeeId}`,
        {
            responseType: "blob",
        }
    );
};


// =====================================================
// PROJECT REPORT
// =====================================================

export const downloadProjectReport = (projectId) => {
    return api.get(
        `/reports/project/${projectId}`,
        {
            responseType: "blob",
        }
    );
};


// =====================================================
// ATTENDANCE REPORT
// =====================================================

export const downloadAttendanceReport = (
    employeeId,
    year,
    month
) => {
    return api.get(
        `/reports/attendance/${employeeId}/${year}/${month}`,
        {
            responseType: "blob",
        }
    );
};


// =====================================================
// MANAGEMENT SUMMARY
// =====================================================

export const getManagementSummary = () => {
    return api.get("/reports/summary");
};