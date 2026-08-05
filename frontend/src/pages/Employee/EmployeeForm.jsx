import {
    Grid,
    TextField,
    Button,
} from "@mui/material";

function EmployeeForm() {
    return (
        <Grid container spacing={2} mt={1}>

            <Grid size={{ xs:12, md:6 }}>
                <TextField
                    fullWidth
                    label="Employee Name"
                />
            </Grid>

            <Grid size={{ xs:12, md:6 }}>
                <TextField
                    fullWidth
                    label="Phone"
                />
            </Grid>

            <Grid size={{ xs:12, md:6 }}>
                <TextField
                    fullWidth
                    label="Email"
                />
            </Grid>

            <Grid size={{ xs:12, md:6 }}>
                <TextField
                    fullWidth
                    label="Designation"
                />
            </Grid>

            <Grid size={{ xs:12 }}>
                <Button
                    variant="contained"
                >
                    Save Employee
                </Button>
            </Grid>

        </Grid>
    );
}

export default EmployeeForm;