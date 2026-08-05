import { Box, Toolbar } from "@mui/material";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { Outlet } from "react-router-dom";

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

                <Outlet />
            </Box>
        </Box>
    );
}

export default DashboardLayout;