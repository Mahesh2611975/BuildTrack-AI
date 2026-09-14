import { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
    Box,
} from "@mui/material";

import useEmployees from "../../hooks/useEmployees";

function AdvanceForm({
    advance = null,
    onSubmit,
    onCancel,
}) {
    const {
        employees,
        loading: employeesLoading,
    } = useEmployees();

    const [formData, setFormData] = useState({
        employee_id: "",
        amount: "",
        advance_date: "",
        reason: "",
    });

    const [errors, setErrors] = useState({});

    // ==========================================================
    // LOAD DATA FOR EDIT
    // ==========================================================

    useEffect(() => {
        if (advance) {
            setFormData({
                employee_id: advance.employee_id || "",
                amount: advance.amount || "",
                advance_date: advance.advance_date || "",
                reason: advance.reason || "",
            });
        } else {
            setFormData({
                employee_id: "",
                amount: "",
                advance_date: "",
                reason: "",
            });
        }

        setErrors({});
    }, [advance]);

    // ==========================================================
    // HANDLE CHANGE
    // ==========================================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.employee_id) {
            newErrors.employee_id =
                "Please select an employee";
        }

        if (
            !formData.amount ||
            Number(formData.amount) <= 0
        ) {
            newErrors.amount =
                "Amount must be greater than 0";
        }

        if (!formData.advance_date) {
            newErrors.advance_date =
                "Advance date is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        const payload = {
            employee_id: Number(formData.employee_id),
            amount: Number(formData.amount),
            advance_date: formData.advance_date,
            reason: formData.reason || null,
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid
                container
                spacing={2}
                sx={{
                    mt: 0.5,
                }}
            >
                {/* ==================================================
                    EMPLOYEE
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
                        label="Employee"
                        name="employee_id"
                        value={formData.employee_id}
                        onChange={handleChange}
                        disabled={employeesLoading}
                        error={!!errors.employee_id}
                        helperText={
                            errors.employee_id ||
                            "Select the employee receiving the advance"
                        }
                    >
                        {employees.length === 0 ? (
                            <MenuItem disabled>
                                No employees available
                            </MenuItem>
                        ) : (
                            employees.map((employee) => (
                                <MenuItem
                                    key={employee.id}
                                    value={employee.id}
                                >
                                    {employee.full_name}
                                    {" - "}
                                    {employee.employee_id}
                                </MenuItem>
                            ))
                        )}
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
                        label="Advance Amount"
                        name="amount"
                        placeholder="Example: 10000"
                        value={formData.amount}
                        onChange={handleChange}
                        inputProps={{
                            min: 1,
                        }}
                        error={!!errors.amount}
                        helperText={
                            errors.amount ||
                            "Enter the advance amount"
                        }
                    />
                </Grid>

                {/* ==================================================
                    DATE
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
                        label="Advance Date"
                        name="advance_date"
                        value={formData.advance_date}
                        onChange={handleChange}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        error={!!errors.advance_date}
                        helperText={
                            errors.advance_date
                        }
                    />
                </Grid>

                {/* ==================================================
                    REASON
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Reason"
                        name="reason"
                        placeholder="Example: Salary advance, medical emergency"
                        value={formData.reason}
                        onChange={handleChange}
                    />
                </Grid>

                {/* ==================================================
                    BUTTONS
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 1.5,
                            mt: 1,
                            flexWrap: "wrap",
                        }}
                    >
                        <Button
                            type="button"
                            onClick={onCancel}
                            variant="outlined"
                            sx={{
                                minWidth: "120px",
                                height: "44px",
                                borderRadius: "24px",
                                borderColor: "#dca323",
                                color: "#8a6411",
                                fontWeight: 600,
                                textTransform: "none",
                                "&:hover": {
                                    borderColor: "#b98513",
                                    backgroundColor: "#fff8e8",
                                },
                            }}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                minWidth: "180px",
                                height: "44px",
                                borderRadius: "24px",
                                backgroundColor: "#e3a923",
                                color: "#241812",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                boxShadow:
                                    "0 3px 7px rgba(0, 0, 0, 0.18)",
                                "&:hover": {
                                    backgroundColor: "#c99216",
                                },
                            }}
                        >
                            {advance
                                ? "Update Advance"
                                : "Save Advance"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </form>
    );
}

export default AdvanceForm;