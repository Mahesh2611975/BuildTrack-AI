import { useState } from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import useEmployees from "../../hooks/useEmployees";


function DailyAdvanceForm({
    onSubmit,
}) {

    const {
        employees,
        loading: employeesLoading,
    } = useEmployees();


    const [formData, setFormData] = useState({
        employee_id: "",
        amount: "",
        transaction_date: "",
        reason: "",
    });


    const [errors, setErrors] = useState({});


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


        if (!formData.transaction_date) {

            newErrors.transaction_date =
                "Transaction date is required";
        }


        setErrors(newErrors);


        if (
            Object.keys(newErrors).length > 0
        ) {

            return;
        }


        // ======================================================
        // SEND DAILY ADVANCE
        // ======================================================

        onSubmit({

            employee_id:
                Number(formData.employee_id),

            advance_id: null,

            amount:
                Number(formData.amount),

            transaction_date:
                formData.transaction_date,

            reason:
                formData.reason || null,
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
                            employeesLoading
                        }
                        error={
                            !!errors.employee_id
                        }
                        helperText={
                            errors.employee_id ||
                            "Select the employee receiving the daily advance"
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
                    DAILY AMOUNT
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
                        label="Daily Advance Amount"
                        name="amount"
                        placeholder="Example: 200"
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
                            errors.amount ||
                            "Example: ₹200 for food"
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
                        label="Transaction Date"
                        name="transaction_date"
                        value={
                            formData.transaction_date
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
                            !!errors.transaction_date
                        }
                        helperText={
                            errors.transaction_date
                        }
                    />

                </Grid>


                {/* ==================================================
                    REASON
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
                        label="Reason"
                        name="reason"
                        placeholder="Example: Food, Travel, Personal expense"
                        value={
                            formData.reason
                        }
                        onChange={
                            handleChange
                        }
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
                        sx={{
                            mt: 1,
                            py: 1.3,
                            fontWeight: 700,
                        }}
                    >

                        SAVE DAILY ADVANCE

                    </Button>

                </Grid>

            </Grid>

        </form>
    );
}


export default DailyAdvanceForm;