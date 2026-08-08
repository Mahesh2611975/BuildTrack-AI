import {
    useState,
    useEffect,
} from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

const initialFormData = {
    project_name: "",
    client_name: "",
    location: "",
    description: "",
    budget: "",
    start_date: "",
    expected_end_date: "",
    status: "Planned",
    contractor_id: "",
};

function ProjectForm({
    onSubmit,
    project,
}) {
    const [formData, setFormData] =
        useState(initialFormData);

    const [errors, setErrors] =
        useState({});

    // =====================================
    // LOAD PROJECT FOR EDIT
    // =====================================

    useEffect(() => {
        if (project) {
            setFormData({
                project_name:
                    project.project_name || "",

                client_name:
                    project.client_name || "",

                location:
                    project.location || "",

                description:
                    project.description || "",

                budget:
                    project.budget ?? "",

                start_date:
                    project.start_date || "",

                expected_end_date:
                    project.expected_end_date || "",

                status:
                    project.status || "Planned",

                contractor_id:
                    project.contractor_id ?? "",
            });
        } else {
            // Reset form for Add Project
            setFormData(initialFormData);
            setErrors({});
        }
    }, [project]);

    // =====================================
    // HANDLE CHANGE
    // =====================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        // Remove error when user starts correcting
        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    // =====================================
    // VALIDATION
    // =====================================

    const validate = () => {
        const newErrors = {};

        if (!formData.project_name.trim()) {
            newErrors.project_name =
                "Project Name is required";
        }

        if (!formData.client_name.trim()) {
            newErrors.client_name =
                "Client Name is required";
        }

        if (!formData.location.trim()) {
            newErrors.location =
                "Location is required";
        }

        if (
            formData.budget === "" ||
            Number(formData.budget) <= 0
        ) {
            newErrors.budget =
                "Budget must be greater than 0";
        }

        if (!formData.start_date) {
            newErrors.start_date =
                "Start Date is required";
        }

        if (!formData.expected_end_date) {
            newErrors.expected_end_date =
                "Expected End Date is required";
        }

        if (
            formData.start_date &&
            formData.expected_end_date &&
            formData.expected_end_date <
                formData.start_date
        ) {
            newErrors.expected_end_date =
                "End date cannot be before start date";
        }

        if (
            formData.contractor_id === "" ||
            Number(formData.contractor_id) <= 0
        ) {
            newErrors.contractor_id =
                "Contractor ID is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================
    // SUBMIT
    // =====================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            project_name:
                formData.project_name.trim(),

            client_name:
                formData.client_name.trim(),

            location:
                formData.location.trim(),

            description:
                formData.description.trim(),

            start_date:
                formData.start_date,

            expected_end_date:
                formData.expected_end_date,

            budget:
                Number(formData.budget),

            status:
                formData.status,

            contractor_id:
                Number(formData.contractor_id),
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid
                container
                spacing={2}
                mt={1}
            >

                {/* PROJECT NAME */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        label="Project Name"
                        name="project_name"
                        value={
                            formData.project_name
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.project_name
                            )
                        }
                        helperText={
                            errors.project_name
                        }
                    />
                </Grid>

                {/* CLIENT NAME */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        label="Client Name"
                        name="client_name"
                        value={
                            formData.client_name
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.client_name
                            )
                        }
                        helperText={
                            errors.client_name
                        }
                    />
                </Grid>

                {/* LOCATION */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        required
                        label="Location"
                        name="location"
                        value={
                            formData.location
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.location
                            )
                        }
                        helperText={
                            errors.location
                        }
                    />
                </Grid>

                {/* DESCRIPTION */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={handleChange}
                    />
                </Grid>

                {/* BUDGET */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Budget"
                        name="budget"
                        value={
                            formData.budget
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.budget
                            )
                        }
                        helperText={
                            errors.budget
                        }
                        inputProps={{
                            min: 0,
                        }}
                    />
                </Grid>

                {/* STATUS */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={
                            formData.status
                        }
                        onChange={handleChange}
                    >
                        <MenuItem value="Planned">
                            Planned
                        </MenuItem>

                        <MenuItem value="In Progress">
                            In Progress
                        </MenuItem>

                        <MenuItem value="Completed">
                            Completed
                        </MenuItem>

                        <MenuItem value="On Hold">
                            On Hold
                        </MenuItem>

                        <MenuItem value="Cancelled">
                            Cancelled
                        </MenuItem>
                    </TextField>
                </Grid>

                {/* CONTRACTOR ID */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Contractor ID"
                        name="contractor_id"
                        value={
                            formData.contractor_id
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.contractor_id
                            )
                        }
                        helperText={
                            errors.contractor_id ||
                            "Enter the contractor database ID"
                        }
                        inputProps={{
                            min: 1,
                        }}
                    />
                </Grid>

                {/* START DATE */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        type="date"
                        label="Start Date"
                        name="start_date"
                        value={
                            formData.start_date
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.start_date
                            )
                        }
                        helperText={
                            errors.start_date
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                {/* EXPECTED END DATE */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        type="date"
                        label="Expected End Date"
                        name="expected_end_date"
                        value={
                            formData.expected_end_date
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.expected_end_date
                            )
                        }
                        helperText={
                            errors.expected_end_date
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                {/* SAVE */}
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