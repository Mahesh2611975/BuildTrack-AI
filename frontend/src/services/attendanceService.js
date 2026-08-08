import api from "./api";

// Get all attendance records
export const getAttendance = () => {
    return api.get("/attendance");
};

// Get attendance for one employee
export const getEmployeeAttendance = (employeeId) => {
    return api.get(`/attendance/employee/${employeeId}`);
};

// Mark attendance
export const markAttendance = (data) => {
    return api.post("/attendance", data);
};