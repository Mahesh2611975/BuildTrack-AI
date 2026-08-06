import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import EmployeePage from "../pages/Employee/EmployeePage";
import ProjectPage from "../pages/Project/ProjectPage";
import Login from "../pages/Login/Login";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    <Route
                        path="employees"
                        element={<EmployeePage />}
                    />

                    <Route
                        path="projects"
                        element={<ProjectPage />}
                    />

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;