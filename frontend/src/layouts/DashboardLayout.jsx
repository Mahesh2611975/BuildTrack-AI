import { Box, Toolbar } from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Dashboard from "../pages/Dashboard/Dashboard";

function DashboardLayout() {
    return (
        <Box sx={{ display: "flex" }}>
            <Navbar />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                }}
            >
                <Toolbar />

                <Dashboard />
            </Box>
        </Box>
    );
}

export default DashboardLayout;