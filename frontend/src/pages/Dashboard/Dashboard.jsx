import { Box, Grid } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";

import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/StatCard";
import ExpenseChart from "../../components/dashboard/ExpenseChart";
import ProjectProgress from "../../components/dashboard/ProjectProgress";

function Dashboard() {
    return (
        <>
            <PageHeader
                title="Dashboard"
                subtitle="Welcome back, Mahesh 👋"
                buttonText="Add Project"
            />

            {/* Statistics Cards */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <StatCard
                        title="Employees"
                        value={25}
                        icon={<PeopleIcon />}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatCard
                        title="Projects"
                        value={8}
                        icon={<BusinessIcon />}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatCard
                        title="Materials"
                        value={120}
                        icon={<InventoryIcon />}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 3 }}>
                    <StatCard
                        title="Equipment"
                        value={15}
                        icon={<EngineeringIcon />}
                    />
                </Grid>
            </Grid>

            {/* Dashboard Widgets */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        lg: "2fr 1fr",
                    },
                    gap: 3,
                    mt: 4,
                }}
            >
                <ExpenseChart />
                <ProjectProgress />
            </Box>
        </>
    );
}

export default Dashboard;