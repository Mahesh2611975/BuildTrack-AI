import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import EmployeePage from "../pages/Employee/EmployeePage";

function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<DashboardLayout />}>

                    <Route index element={<Dashboard />} />

                    <Route
                        path="employees"
                        element={<EmployeePage />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;