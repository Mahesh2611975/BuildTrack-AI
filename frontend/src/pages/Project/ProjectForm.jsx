import { useState, useEffect } from "react";

import {
    Grid,
    TextField,
    Button,
} from "@mui/material";

function ProjectForm({ onSubmit, project }) {
    const [formData, setFormData] = useState({
        project_name: "",
        client_name: "",
        location: "",
        description: "",
        budget: "",
        start_date: "",
        expected_end_date: "",
        status: "Planning",
        contractor_id: "",
    });

    useEffect(() => {
        if (project) {
            setFormData({
                project_name: project.project_name,
                client_name: project.client_name,
                location: project.location,
                description: project.description,
                budget: project.budget,
                start_date: project.start_date,
                expected_end_date: project.expected_end_date,
                status: project.status,
                contractor_id: project.contractor_id,
            });
        }
    }, [project]);

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
                        label="Project Name"
                        name="project_name"
                        value={formData.project_name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Client Name"
                        name="client_name"
                        value={formData.client_name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Contractor ID"
                        name="contractor_id"
                        value={formData.contractor_id}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="date"
                        name="expected_end_date"
                        value={formData.expected_end_date}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                    >
                        Save Project
                    </Button>
                </Grid>

            </Grid>
        </form>
    );
}

export default ProjectForm;