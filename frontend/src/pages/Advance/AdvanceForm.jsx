import {
    useEffect,
    useState,
} from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import useEmployees from "../../hooks/useEmployees";


function AdvanceForm({
    onSubmit,
    advance,
}) {

    const {
        employees,
        loading: employeesLoading,
    } = useEmployees();


    const [formData, setFormData] =
        useState({
            employee_id: "",
            amount: "",
            advance_date: "",
            reason: "",
            status: "Pending",
        });


    const [errors, setErrors] =
        useState({});


    // ==========================================================
    // LOAD DATA FOR EDIT
    // ==========================================================

    useEffect(() => {

        if (advance) {

            setFormData({

                employee_id:
                    advance.employee_id,

                amount:
                    advance.amount,

                advance_date:
                    advance.advance_date,

                reason:
                    advance.reason || "",

                status:
                    advance.status || "Pending",

            });

        } else {

            setFormData({

                employee_id: "",
                amount: "",
                advance_date: "",
                reason: "",
                status: "Pending",

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


        if (
            Object.keys(newErrors).length > 0
        ) {

            return;
        }


        // ------------------------------------------------------
        // CREATE
        // ------------------------------------------------------

        if (!advance) {

            onSubmit({

                employee_id:
                    Number(formData.employee_id),

                amount:
                    Number(formData.amount),

                advance_date:
                    formData.advance_date,

                reason:
                    formData.reason || null,

            });

            return;
        }


        // ------------------------------------------------------
        // UPDATE
        // ------------------------------------------------------

        onSubmit({

            amount:
                Number(formData.amount),

            advance_date:
                formData.advance_date,

            reason:
                formData.reason || null,

            status:
                formData.status,

        });
    };


    return (

        <form
            onSubmit={handleSubmit}
        >

            <Grid
                container
                spacing={2}
                sx={{ mt: 1 }}
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
                        value={
                            formData.employee_id
                        }
                        onChange={
                            handleChange
                        }
                        disabled={
                            !!advance ||
                            employeesLoading
                        }
                        error={
                            !!errors.employee_id
                        }
                        helperText={
                            errors.employee_id ||
                            (
                                advance
                                    ? "Employee cannot be changed"
                                    : "Select the employee receiving the advance"
                            )
                        }
                    >

                        {employees.length === 0 ? (

                            <MenuItem
                                disabled
                            >
                                No employees available
                            </MenuItem>

                        ) : (

                            employees.map(
                                (employee) => (

                                    <MenuItem
                                        key={
                                            employee.id
                                        }
                                        value={
                                            employee.id
                                        }
                                    >

                                        {employee.full_name}
                                        {" - "}
                                        {employee.employee_id}

                                    </MenuItem>

                                )
                            )

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
                        value={
                            formData.amount
                        }
                        onChange={
                            handleChange
                        }
                        inputProps={{
                            min: 1,
                        }}
                        error={
                            !!errors.amount
                        }
                        helperText={
                            errors.amount
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
                        value={
                            formData.advance_date
                        }
                        onChange={
                            handleChange
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        error={
                            !!errors.advance_date
                        }
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
                        rows={3}
                        label="Reason"
                        name="reason"
                        placeholder="Enter reason for advance"
                        value={
                            formData.reason
                        }
                        onChange={
                            handleChange
                        }
                    />

                </Grid>


                {/* ==================================================
                    STATUS - EDIT ONLY
                ================================================== */}

                {advance && (

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
                            onChange={
                                handleChange
                            }
                        >

                            <MenuItem value="Pending">
                                Pending
                            </MenuItem>

                            <MenuItem value="Approved">
                                Approved
                            </MenuItem>

                            <MenuItem value="Rejected">
                                Rejected
                            </MenuItem>

                            <MenuItem value="Paid">
                                Paid
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
                        sx={{
                            mt: 1,
                            py: 1.3,
                            fontWeight: 700,
                        }}
                    >

                        {advance
                            ? "UPDATE ADVANCE"
                            : "SAVE ADVANCE"}

                    </Button>

                </Grid>

            </Grid>

        </form>

    );
}


export default AdvanceForm;