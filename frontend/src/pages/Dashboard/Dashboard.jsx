import { Grid } from "@mui/material";
import StatCard from "../../components/dashboard/StatCard";

function Dashboard() {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 3 }}>
                <StatCard
                    title="Employees"
                    value="25"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <StatCard
                    title="Projects"
                    value="8"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <StatCard
                    title="Materials"
                    value="120"
                />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <StatCard
                    title="Equipment"
                    value="15"
                />
            </Grid>
        </Grid>
    );
}

export default Dashboard;