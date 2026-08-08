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


const ATTENDANCE_STATUS = [
    "Present",
    "Absent",
    "Leave",
];


function AttendanceForm({
    employees = [],
    onSubmit,
}) {

    const [formData, setFormData] =
        useState({

            employee_id: "",
            date: "",
            status: "Present",

        });


    const [errors, setErrors] =
        useState({});


    useEffect(() => {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        setFormData({

            employee_id: "",
            date: today,
            status: "Present",

        });

        setErrors({});

    }, []);


    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]: value,

            })
        );


        setErrors(
            (previous) => ({

                ...previous,

                [name]: "",

            })
        );
    };


    const validate = () => {

        const newErrors = {};


        if (!formData.employee_id) {

            newErrors.employee_id =
                "Employee is required";

        }


        if (!formData.date) {

            newErrors.date =
                "Date is required";

        }


        if (!formData.status) {

            newErrors.status =
                "Status is required";

        }


        setErrors(newErrors);


        return (
            Object.keys(newErrors)
                .length === 0
        );
    };


    const handleSubmit = (event) => {

        event.preventDefault();


        if (!validate()) {
            return;
        }


        const data = {

            employee_id:
                Number(
                    formData.employee_id
                ),

            date:
                formData.date,

            status:
                formData.status,

        };


        onSubmit(data);
    };


    return (

        <form
            onSubmit={handleSubmit}
            noValidate
        >

            <Grid
                container
                spacing={2}
                mt={1}
            >

                {/* Employee */}

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
                        error={
                            Boolean(
                                errors.employee_id
                            )
                        }
                        helperText={
                            errors.employee_id
                        }
                    >

                        <MenuItem value="">
                            Select Employee
                        </MenuItem>


                        {employees
                            .filter(
                                (employee) =>
                                    employee.is_active
                            )
                            .map(
                                (employee) => (

                                    <MenuItem
                                        key={
                                            employee.id
                                        }
                                        value={
                                            employee.id
                                        }
                                    >

                                        {employee.employee_id}
                                        {" - "}
                                        {employee.full_name}

                                    </MenuItem>

                                )
                            )}

                    </TextField>

                </Grid>


                {/* Date */}

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
                        label="Date"
                        name="date"
                        value={
                            formData.date
                        }
                        onChange={
                            handleChange
                        }
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={
                            Boolean(
                                errors.date
                            )
                        }
                        helperText={
                            errors.date
                        }
                    />

                </Grid>


                {/* Status */}

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
                        label="Status"
                        name="status"
                        value={
                            formData.status
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            Boolean(
                                errors.status
                            )
                        }
                        helperText={
                            errors.status
                        }
                    >

                        {ATTENDANCE_STATUS.map(
                            (status) => (

                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    {status}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* Submit */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                    >
                        MARK ATTENDANCE
                    </Button>

                </Grid>

            </Grid>

        </form>
    );
}


export default AttendanceForm;