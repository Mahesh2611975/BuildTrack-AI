import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import EmployeePage from "../pages/Employee/EmployeePage";
import ProjectPage from "../pages/Project/ProjectPage";
import MaterialPage from "../pages/Material/MaterialPage";
import ContractorPage from "../pages/Contractor/ContractorPage";
import AttendancePage from "../pages/Attendance/AttendancePage";
import Login from "../pages/Login/Login";

import ProtectedRoute from "./ProtectedRoute";
import PayrollPage from "../pages/Payroll/PayrollPage";
import ReportsPage from "../pages/Reports/ReportsPage";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Login */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                {/* Protected Application */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* Dashboard */}

                    <Route
                        index
                        element={<Dashboard />}
                    />


                    {/* Employees */}

                    <Route
                        path="employees"
                        element={<EmployeePage />}
                    />


                    {/* Projects */}

                    <Route
                        path="projects"
                        element={<ProjectPage />}
                    />


                    {/* Contractors */}

                    <Route
                        path="contractors"
                        element={<ContractorPage />}
                    />


                    {/* Attendance */}

                    <Route
                        path="attendance"
                        element={<AttendancePage />}
                    />
                 

                    {/* Materials */}

                    <Route
                        path="materials"
                        element={<MaterialPage />}
                    />
                    
                    <Route
                        path="payroll"
                        element={<PayrollPage />}
                    />
                    <Route
                        path="reports"
                        element={<ReportsPage />}
                    />
                </Route>

            </Routes>

        </BrowserRouter>

    );
}


export default AppRoutes;