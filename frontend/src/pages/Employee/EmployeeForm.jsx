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


const DESIGNATIONS = [
    "Site Manager",
    "Site Engineer",
    "Civil Engineer",
    "Project Manager",
    "Supervisor",
    "Architect",
    "Accountant",
    "Safety Officer",
    "Electrician",
    "Plumber",
    "Labour",
];


const DEPARTMENTS = [
    "Management",
    "Engineering",
    "Construction",
    "Finance",
    "Safety",
    "Electrical",
    "Plumbing",
    "Human Resources",
];


function EmployeeForm({
    onSubmit,
    employee = null,
}) {

    const [formData, setFormData] = useState({
        full_name: "",
        mobile_number: "",
        email: "",
        designation: "",
        department: "",
        salary: "",
        joining_date: "",
        is_active: true,
    });


    const [errors, setErrors] = useState({});


    useEffect(() => {

        if (employee) {

            setFormData({
                full_name:
                    employee.full_name || "",

                mobile_number:
                    employee.mobile_number || "",

                email:
                    employee.email || "",

                designation:
                    employee.designation || "",

                department:
                    employee.department || "",

                salary:
                    employee.salary ?? "",

                joining_date:
                    employee.joining_date || "",

                is_active:
                    employee.is_active ?? true,
            });

        } else {

            setFormData({
                full_name: "",
                mobile_number: "",
                email: "",
                designation: "",
                department: "",
                salary: "",
                joining_date: "",
                is_active: true,
            });

        }

        setErrors({});

    }, [employee]);


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


        // Full name
        if (!formData.full_name.trim()) {

            newErrors.full_name =
                "Employee Name is required";

        }


        // Mobile
        if (!formData.mobile_number.trim()) {

            newErrors.mobile_number =
                "Mobile number is required";

        } else if (
            !/^[6-9]\d{9}$/.test(
                formData.mobile_number
            )
        ) {

            newErrors.mobile_number =
                "Enter a valid 10-digit mobile number";

        }


        // Email
        if (!formData.email.trim()) {

            newErrors.email =
                "Email is required";

        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email
            )
        ) {

            newErrors.email =
                "Enter a valid email address";

        }


        // Designation
        if (!formData.designation) {

            newErrors.designation =
                "Designation is required";

        }


        // Department
        if (!formData.department) {

            newErrors.department =
                "Department is required";

        }


        // Salary
        if (
            formData.salary === "" ||
            formData.salary === null
        ) {

            newErrors.salary =
                "Salary is required";

        } else if (
            Number(formData.salary) <= 0
        ) {

            newErrors.salary =
                "Salary must be greater than 0";

        }


        // Joining date
        if (!formData.joining_date) {

            newErrors.joining_date =
                "Joining date is required";

        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };


    const handleSubmit = (event) => {

        event.preventDefault();


        if (!validate()) {
            return;
        }


        const data = {

            full_name:
                formData.full_name.trim(),

            mobile_number:
                formData.mobile_number.trim(),

            email:
                formData.email.trim(),

            designation:
                formData.designation,

            department:
                formData.department,

            salary:
                Number(formData.salary),

            joining_date:
                formData.joining_date,

            is_active:
                Boolean(formData.is_active),
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

                {/* Name */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        required
                        label="Employee Name"
                        name="full_name"
                        value={
                            formData.full_name
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.full_name
                            )
                        }
                        helperText={
                            errors.full_name
                        }
                    />

                </Grid>


                {/* Mobile */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        required
                        label="Mobile Number"
                        name="mobile_number"
                        value={
                            formData.mobile_number
                        }
                        onChange={handleChange}
                        inputProps={{
                            maxLength: 10,
                        }}
                        error={
                            Boolean(
                                errors.mobile_number
                            )
                        }
                        helperText={
                            errors.mobile_number ||
                            "Enter 10-digit mobile number"
                        }
                    />

                </Grid>


                {/* Email */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        required
                        type="email"
                        label="Email"
                        name="email"
                        value={
                            formData.email
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.email
                            )
                        }
                        helperText={
                            errors.email
                        }
                    />

                </Grid>


                {/* Designation */}

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
                        label="Designation"
                        name="designation"
                        value={
                            formData.designation
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.designation
                            )
                        }
                        helperText={
                            errors.designation
                        }
                    >

                        <MenuItem value="">
                            Select Designation
                        </MenuItem>

                        {DESIGNATIONS.map(
                            (designation) => (

                                <MenuItem
                                    key={
                                        designation
                                    }
                                    value={
                                        designation
                                    }
                                >
                                    {designation}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* Department */}

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
                        label="Department"
                        name="department"
                        value={
                            formData.department
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.department
                            )
                        }
                        helperText={
                            errors.department
                        }
                    >

                        <MenuItem value="">
                            Select Department
                        </MenuItem>

                        {DEPARTMENTS.map(
                            (department) => (

                                <MenuItem
                                    key={
                                        department
                                    }
                                    value={
                                        department
                                    }
                                >
                                    {department}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* Salary */}

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
                        label="Salary"
                        name="salary"
                        value={
                            formData.salary
                        }
                        onChange={handleChange}
                        inputProps={{
                            min: 1,
                        }}
                        error={
                            Boolean(
                                errors.salary
                            )
                        }
                        helperText={
                            errors.salary ||
                            "Enter monthly salary"
                        }
                    />

                </Grid>


                {/* Joining Date */}

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
                        label="Joining Date"
                        name="joining_date"
                        value={
                            formData.joining_date
                        }
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={
                            Boolean(
                                errors.joining_date
                            )
                        }
                        helperText={
                            errors.joining_date
                        }
                    />

                </Grid>


                {/* Status */}

                {employee && (

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
                            name="is_active"
                            value={
                                formData.is_active
                            }
                            onChange={(event) => {

                                setFormData(
                                    (
                                        previous
                                    ) => ({
                                        ...previous,
                                        is_active:
                                            event
                                                .target
                                                .value ===
                                            "true",
                                    })
                                );

                            }}
                        >

                            <MenuItem value="true">
                                Active
                            </MenuItem>

                            <MenuItem value="false">
                                Inactive
                            </MenuItem>

                        </TextField>

                    </Grid>

                )}


                {/* Save */}

                <Grid size={{ xs: 12 }}>

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        size="large"
                    >
                        {employee
                            ? "UPDATE EMPLOYEE"
                            : "SAVE EMPLOYEE"}
                    </Button>

                </Grid>

            </Grid>

        </form>
    );
}


export default EmployeeForm;