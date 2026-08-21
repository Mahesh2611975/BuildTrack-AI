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


    // =====================================================
    // LOAD EMPLOYEE FOR EDIT
    // =====================================================

    useEffect(() => {

        if (employee) {

            setFormData({
                full_name: employee.full_name || "",
                mobile_number: employee.mobile_number || "",
                email: employee.email || "",
                designation: employee.designation || "",
                department: employee.department || "",
                salary: employee.salary ?? "",
                joining_date: employee.joining_date
                    ? employee.joining_date.substring(0, 10)
                    : "",
                is_active: employee.is_active ?? true,
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


    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const newErrors = {};


        if (!formData.full_name.trim()) {
            newErrors.full_name =
                "Employee Name is required";
        }


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


        if (!formData.designation) {
            newErrors.designation =
                "Designation is required";
        }


        if (!formData.department) {
            newErrors.department =
                "Department is required";
        }


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


        if (!formData.joining_date) {
            newErrors.joining_date =
                "Joining date is required";
        }


        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

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


    // =====================================================
    // FIELD STYLE
    // =====================================================

    const fieldSx = {

        "& .MuiOutlinedInput-root": {

            borderRadius: "12px",

            backgroundColor: "#fffdf8",

            "& fieldset": {
                borderColor: "#dfcdb5",
            },

            "&:hover fieldset": {
                borderColor: "#dca62f",
            },

            "&.Mui-focused fieldset": {
                borderColor: "#dca62f",
                borderWidth: "2px",
            },

        },

        "& .MuiInputLabel-root": {
            color: "#8a7568",
        },

        "& .MuiInputLabel-root.Mui-focused": {
            color: "#bd8a20",
        },

        "& .MuiFormHelperText-root": {
            marginLeft: "4px",
            color: "#8a7568",
        },

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <form
            onSubmit={handleSubmit}
            noValidate
        >

            <Grid
                container
                spacing={2.5}
                sx={{
                    mt: 0.5,
                    pb: 1,
                }}
            >

                {/* ================================================= */}
                {/* EMPLOYEE NAME */}
                {/* ================================================= */}

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
                        value={formData.full_name}
                        onChange={handleChange}
                        error={Boolean(errors.full_name)}
                        helperText={errors.full_name || " "}
                        sx={fieldSx}
                    />

                </Grid>


                {/* ================================================= */}
                {/* MOBILE */}
                {/* ================================================= */}

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
                        value={formData.mobile_number}
                        onChange={handleChange}
                        inputProps={{
                            maxLength: 10,
                        }}
                        error={Boolean(errors.mobile_number)}
                        helperText={
                            errors.mobile_number ||
                            "Enter 10-digit mobile number"
                        }
                        sx={fieldSx}
                    />

                </Grid>


                {/* ================================================= */}
                {/* EMAIL */}
                {/* ================================================= */}

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
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email || " "}
                        sx={fieldSx}
                    />

                </Grid>


                {/* ================================================= */}
                {/* DESIGNATION */}
                {/* ================================================= */}

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
                        value={formData.designation}
                        onChange={handleChange}
                        error={Boolean(errors.designation)}
                        helperText={errors.designation || " "}
                        sx={fieldSx}
                    >

                        <MenuItem value="">
                            Select Designation
                        </MenuItem>

                        {DESIGNATIONS.map(
                            (designation) => (

                                <MenuItem
                                    key={designation}
                                    value={designation}
                                >
                                    {designation}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* ================================================= */}
                {/* DEPARTMENT */}
                {/* ================================================= */}

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
                        value={formData.department}
                        onChange={handleChange}
                        error={Boolean(errors.department)}
                        helperText={errors.department || " "}
                        sx={fieldSx}
                    >

                        <MenuItem value="">
                            Select Department
                        </MenuItem>

                        {DEPARTMENTS.map(
                            (department) => (

                                <MenuItem
                                    key={department}
                                    value={department}
                                >
                                    {department}
                                </MenuItem>

                            )
                        )}

                    </TextField>

                </Grid>


                {/* ================================================= */}
                {/* SALARY */}
                {/* ================================================= */}

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
                        value={formData.salary}
                        onChange={handleChange}
                        inputProps={{
                            min: 1,
                        }}
                        error={Boolean(errors.salary)}
                        helperText={
                            errors.salary ||
                            "Enter monthly salary"
                        }
                        sx={fieldSx}
                    />

                </Grid>


                {/* ================================================= */}
                {/* JOINING DATE */}
                {/* ================================================= */}

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
                        value={formData.joining_date}
                        onChange={handleChange}
                        error={Boolean(errors.joining_date)}
                        helperText={errors.joining_date || " "}
                        sx={fieldSx}
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                    />
                </Grid>

                {/* ================================================= */}
                {/* STATUS - EDIT ONLY */}
                {/* ================================================= */}

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
                                String(
                                    formData.is_active
                                )
                            }
                            onChange={(event) => {

                                setFormData(
                                    (previous) => ({
                                        ...previous,
                                        is_active:
                                            event.target.value ===
                                            "true",
                                    })
                                );

                            }}
                            sx={fieldSx}
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


                {/* ================================================= */}
                {/* SAVE / UPDATE */}
                {/* ================================================= */}

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
                        sx={{
                            mt: 0.5,
                            py: 1.35,

                            borderRadius: "12px",

                            background:
                                "linear-gradient(90deg, #dca62f, #c89425)",

                            color: "#2d211d",

                            fontSize: "15px",

                            fontWeight: 800,

                            boxShadow:
                                "0 5px 12px rgba(190, 140, 32, 0.28)",

                            "&:hover": {
                                background:
                                    "linear-gradient(90deg, #c89425, #b9821c)",

                                boxShadow:
                                    "0 7px 16px rgba(190, 140, 32, 0.35)",
                            },
                        }}
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