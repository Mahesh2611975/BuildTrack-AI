import { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import { getProjects } from "../../services/projectService";


function ExpensesForm({
    onSubmit,
    expense = null,
}) {

    const [projects, setProjects] = useState([]);

    const [loadingProjects, setLoadingProjects] =
        useState(true);

    const [formData, setFormData] = useState({
        expense_code: "",
        project_id: "",
        category: "",
        amount: "",
        expense_date: "",
        description: "",
    });

    const [errors, setErrors] = useState({});


    // ==========================================================
    // LOAD PROJECTS
    // ==========================================================

    useEffect(() => {

        const loadProjects = async () => {

            setLoadingProjects(true);

            try {

                const response =
                    await getProjects();

                console.log(
                    "EXPENSE PROJECTS:",
                    response.data
                );

                setProjects(
                    response.data || []
                );

            } catch (error) {

                console.error(
                    "Failed to load projects:",
                    error
                );

            } finally {

                setLoadingProjects(false);
            }
        };

        loadProjects();

    }, []);


    // ==========================================================
    // LOAD EXPENSE FOR EDIT
    // ==========================================================

    useEffect(() => {

        if (expense) {

            setFormData({
                expense_code:
                    expense.expense_code || "",

                project_id:
                    expense.project_id || "",

                category:
                    expense.category || "",

                amount:
                    expense.amount ?? "",

                expense_date:
                    expense.expense_date || "",

                description:
                    expense.description || "",
            });

        } else {

            setFormData({
                expense_code: "",
                project_id: "",
                category: "",
                amount: "",
                expense_date: "",
                description: "",
            });
        }

        setErrors({});

    }, [expense]);


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


        if (!expense &&
            !formData.expense_code.trim()) {

            newErrors.expense_code =
                "Expense ID is required";
        }


        if (!formData.project_id) {

            newErrors.project_id =
                "Project is required";
        }


        if (!formData.category) {

            newErrors.category =
                "Category is required";
        }


        if (
            !formData.amount ||
            Number(formData.amount) <= 0
        ) {

            newErrors.amount =
                "Amount must be greater than 0";
        }


        if (!formData.expense_date) {

            newErrors.expense_date =
                "Expense date is required";
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

            // Required when creating.
            // Not sent during update because
            // ExpenseUpdate doesn't contain it.

            ...(expense
                ? {}
                : {
                    expense_code:
                        formData.expense_code.trim(),
                }),

            project_id:
                Number(formData.project_id),

            category:
                formData.category,

            amount:
                Number(formData.amount),

            expense_date:
                formData.expense_date,

            description:
                formData.description.trim() ||
                null,
        };


        console.log(
            "EXPENSE PAYLOAD:",
            submitData
        );


        onSubmit(submitData);
    };


    return (

        <form onSubmit={handleSubmit}>

            <Grid
                container
                spacing={2}
                mt={1}
            >

                {/* ==================================================
                    EXPENSE CODE
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        required={!expense}
                        label="Expense ID"
                        name="expense_code"
                        value={
                            formData.expense_code
                        }
                        onChange={
                            handleChange
                        }
                        disabled={!!expense}
                        error={
                            !!errors.expense_code
                        }
                        helperText={
                            errors.expense_code ||
                            "Example: EXP001"
                        }
                    />

                </Grid>


                {/* ==================================================
                    PROJECT
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
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
                        disabled={
                            loadingProjects
                        }
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
                    CATEGORY
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        select
                        fullWidth
                        required
                        label="Expense Category"
                        name="category"
                        value={
                            formData.category
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.category
                        }
                        helperText={
                            errors.category
                        }
                    >

                        <MenuItem value="">
                            Select Category
                        </MenuItem>

                        <MenuItem value="Material">
                            Material
                        </MenuItem>

                        <MenuItem value="Labor">
                            Labor
                        </MenuItem>

                        <MenuItem value="Equipment Rental">
                            Equipment Rental
                        </MenuItem>

                        <MenuItem value="Fuel">
                            Fuel
                        </MenuItem>

                        <MenuItem value="Transportation">
                            Transportation
                        </MenuItem>

                        <MenuItem value="Utilities">
                            Utilities
                        </MenuItem>

                        <MenuItem value="Maintenance">
                            Maintenance
                        </MenuItem>

                        <MenuItem value="Other">
                            Other
                        </MenuItem>

                    </TextField>

                </Grid>


                {/* ==================================================
                    AMOUNT
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
                        type="number"
                        label="Amount"
                        name="amount"
                        value={
                            formData.amount
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.amount
                        }
                        helperText={
                            errors.amount
                        }
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                step: "0.01",
                            },
                        }}
                    />

                </Grid>


                {/* ==================================================
                    EXPENSE DATE
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
                        label="Expense Date"
                        name="expense_date"
                        value={
                            formData.expense_date
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.expense_date
                        }
                        helperText={
                            errors.expense_date
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />

                </Grid>


                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        name="description"
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                        placeholder="Enter expense details..."
                    />

                </Grid>


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
                        disabled={
                            loadingProjects
                        }
                    >

                        {expense
                            ? "Update Expense"
                            : "Save Expense"}

                    </Button>

                </Grid>

            </Grid>

        </form>
    );
}


export default ExpensesForm;