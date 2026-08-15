import { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import { getEquipment } from "../../services/equipmentService";
import { getProjects } from "../../services/projectService";


function EquipmentAssignmentForm({
    onSubmit,
    assignment = null,
}) {

    const [equipmentList, setEquipmentList] = useState([]);
    const [projects, setProjects] = useState([]);

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        equipment_id: "",
        project_id: "",
        assigned_date: "",
        expected_return_date: "",
        status: "Assigned",
    });

    const [errors, setErrors] = useState({});


    // ==========================================================
    // LOAD EQUIPMENT + PROJECTS
    // ==========================================================

    useEffect(() => {

        const loadData = async () => {

            setLoading(true);

            try {

                const [
                    equipmentResponse,
                    projectsResponse,
                ] = await Promise.all([
                    getEquipment(),
                    getProjects(),
                ]);

                setEquipmentList(
                    equipmentResponse.data || []
                );

                setProjects(
                    projectsResponse.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load assignment data:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        loadData();

    }, []);


    // ==========================================================
    // LOAD ASSIGNMENT FOR EDIT
    // ==========================================================

    useEffect(() => {

        if (assignment) {

            setFormData({
                equipment_id:
                    assignment.equipment_id || "",

                project_id:
                    assignment.project_id || "",

                assigned_date:
                    assignment.assigned_date || "",

                expected_return_date:
                    assignment.expected_return_date || "",

                status:
                    assignment.status || "Assigned",
            });

        } else {

            setFormData({
                equipment_id: "",
                project_id: "",
                assigned_date: "",
                expected_return_date: "",
                status: "Assigned",
            });
        }

        setErrors({});

    }, [assignment]);


    // ==========================================================
    // HANDLE CHANGE
    // ==========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: "",
        });
    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = (e) => {

        e.preventDefault();

        const newErrors = {};


        if (!formData.equipment_id) {

            newErrors.equipment_id =
                "Equipment is required";
        }


        if (!formData.project_id) {

            newErrors.project_id =
                "Project is required";
        }


        if (!formData.assigned_date) {

            newErrors.assigned_date =
                "Assigned date is required";
        }


        // Expected return date cannot be before
        // assigned date

        if (
            formData.expected_return_date &&
            formData.assigned_date &&
            formData.expected_return_date <
                formData.assigned_date
        ) {

            newErrors.expected_return_date =
                "Return date cannot be before assigned date";
        }


        setErrors(newErrors);


        if (
            Object.keys(newErrors).length > 0
        ) {
            return;
        }


        // ======================================================
        // CREATE PAYLOAD
        // ======================================================

        const submitData = {

            equipment_id:
                Number(formData.equipment_id),

            project_id:
                Number(formData.project_id),

            assigned_date:
                formData.assigned_date,

            expected_return_date:
                formData.expected_return_date ||
                null,

            status:
                formData.status,
        };


        console.log(
            "EQUIPMENT ASSIGNMENT:",
            submitData
        );


        onSubmit(submitData);
    };


    // ==========================================================
    // AVAILABLE EQUIPMENT
    // ==========================================================

    const availableEquipment =
        equipmentList.filter((equipment) => {

            // When editing, keep the currently
            // assigned equipment visible.

            if (
                assignment &&
                equipment.id ===
                    assignment.equipment_id
            ) {
                return true;
            }

            return (
                equipment.status ===
                "Available"
            );
        });


    return (

        <form onSubmit={handleSubmit}>

            <Grid
                container
                spacing={2}
                mt={1}
            >

                {/* ==================================================
                    EQUIPMENT
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <TextField
                        select
                        fullWidth
                        required
                        label="Equipment"
                        name="equipment_id"
                        value={
                            formData.equipment_id
                        }
                        onChange={
                            handleChange
                        }
                        disabled={loading}
                        error={
                            !!errors.equipment_id
                        }
                        helperText={
                            errors.equipment_id ||
                            "Only available equipment can be assigned"
                        }
                    >

                        <MenuItem value="">
                            Select Equipment
                        </MenuItem>

                        {availableEquipment.map(
                            (equipment) => (

                                <MenuItem
                                    key={
                                        equipment.id
                                    }
                                    value={
                                        equipment.id
                                    }
                                >

                                    {equipment.equipment_code}
                                    {" - "}
                                    {equipment.equipment_name}

                                    {" ("}
                                    {equipment.ownership_type}
                                    {")"}

                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* ==================================================
                    PROJECT
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <TextField
                        select
                        fullWidth
                        required
                        label="Project"
                        name="project_id"
                        value={
                            formData.project_id
                        }
                        onChange={
                            handleChange
                        }
                        disabled={loading}
                        error={
                            !!errors.project_id
                        }
                        helperText={
                            errors.project_id
                        }
                    >

                        <MenuItem value="">
                            Select Project
                        </MenuItem>

                        {projects.map(
                            (project) => (

                                <MenuItem
                                    key={
                                        project.id
                                    }
                                    value={
                                        project.id
                                    }
                                >

                                    {project.project_id}
                                    {" - "}
                                    {project.project_name}

                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* ==================================================
                    ASSIGNED DATE
                ================================================== */}

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
                        label="Assigned Date"
                        name="assigned_date"
                        value={
                            formData.assigned_date
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.assigned_date
                        }
                        helperText={
                            errors.assigned_date
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                </Grid>


                {/* ==================================================
                    EXPECTED RETURN DATE
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        type="date"
                        label="Expected Return Date"
                        name="expected_return_date"
                        value={
                            formData.expected_return_date
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.expected_return_date
                        }
                        helperText={
                            errors.expected_return_date
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                </Grid>


                {/* ==================================================
                    STATUS — EDIT ONLY
                ================================================== */}

                {assignment && (

                    <Grid
                        size={{
                            xs: 12,
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
                            onChange={
                                handleChange
                            }
                        >

                            <MenuItem value="Assigned">
                                Assigned
                            </MenuItem>

                            <MenuItem value="Returned">
                                Returned
                            </MenuItem>

                        </TextField>

                    </Grid>

                )}


                {/* ==================================================
                    SAVE
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={loading}
                    >

                        {assignment
                            ? "Update Assignment"
                            : "Assign Equipment"}

                    </Button>

                </Grid>

            </Grid>

        </form>
    );
}


export default EquipmentAssignmentForm;