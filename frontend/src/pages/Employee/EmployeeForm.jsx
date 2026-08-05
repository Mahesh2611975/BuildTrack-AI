import { useState } from "react";
import { Grid, TextField, Button } from "@mui/material";

function EmployeeForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        designation: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} mt={1}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Employee Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Designation"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                    >
                        Save Employee
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
}

export default EmployeeForm;