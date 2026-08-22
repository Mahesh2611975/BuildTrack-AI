import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Box,
    Button,
    Card,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import {
    getSalaryStructures,
    createSalaryStructure,
    updateSalaryStructure,
} from "../../services/salaryStructureService";

import {
    getEmployees,
} from "../../services/employeeService";


function SalaryPage() {

    // =====================================================
    // STATE
    // =====================================================

    const [salaryStructures, setSalaryStructures] =
        useState([]);

    const [employees, setEmployees] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [dialogOpen, setDialogOpen] =
        useState(false);

    const [selectedSalary, setSelectedSalary] =
        useState(null);

    const [saving, setSaving] =
        useState(false);

    const [errors, setErrors] =
        useState({});


    const [formData, setFormData] = useState({
        employee_id: "",
        basic_salary: "",
        hra: "",
        allowance: "",
        pf: "",
        professional_tax: "",
    });


    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                salaryResponse,
                employeeResponse,
            ] = await Promise.all([
                getSalaryStructures(),
                getEmployees(),
            ]);


            setSalaryStructures(
                salaryResponse.data || []
            );

            setEmployees(
                employeeResponse.data || []
            );


        } catch (error) {

            console.error(
                "Failed to load salary data:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to load salary data"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadData();

    }, []);


    // =====================================================
    // EMPLOYEE LOOKUP
    // =====================================================

    const getEmployee = (employeeId) => {

        return employees.find(
            (employee) =>
                employee.id === employeeId
        );
    };


    // =====================================================
    // AVAILABLE EMPLOYEES
    // =====================================================

    const availableEmployees = useMemo(() => {

        return employees.filter(
            (employee) => {

                const alreadyHasSalary =
                    salaryStructures.some(
                        (salary) =>
                            salary.employee_id ===
                            employee.id
                    );

                return (
                    !alreadyHasSalary ||
                    (
                        selectedSalary &&
                        selectedSalary.employee_id ===
                        employee.id
                    )
                );
            }
        );

    }, [
        employees,
        salaryStructures,
        selectedSalary,
    ]);


    // =====================================================
    // FORM CHANGE
    // =====================================================

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


    // =====================================================
    // OPEN ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedSalary(null);

        setFormData({
            employee_id: "",
            basic_salary: "",
            hra: "",
            allowance: "",
            pf: "",
            professional_tax: "",
        });

        setErrors({});

        setDialogOpen(true);
    };


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleEdit = (salary) => {

        setSelectedSalary(salary);

        setFormData({
            employee_id:
                salary.employee_id,

            basic_salary:
                salary.basic_salary ?? "",

            hra:
                salary.hra ?? "",

            allowance:
                salary.allowance ?? "",

            pf:
                salary.pf ?? "",

            professional_tax:
                salary.professional_tax ?? "",
        });

        setErrors({});

        setDialogOpen(true);
    };


    // =====================================================
    // CLOSE DIALOG
    // =====================================================

    const handleClose = () => {

        if (saving) {
            return;
        }

        setDialogOpen(false);

        setSelectedSalary(null);

        setErrors({});
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const newErrors = {};


        if (!formData.employee_id) {

            newErrors.employee_id =
                "Employee is required";
        }


        if (
            formData.basic_salary === "" ||
            Number(formData.basic_salary) <= 0
        ) {

            newErrors.basic_salary =
                "Basic salary must be greater than 0";
        }


        if (
            formData.hra === "" ||
            Number(formData.hra) < 0
        ) {

            newErrors.hra =
                "HRA cannot be negative";
        }


        if (
            formData.allowance === "" ||
            Number(formData.allowance) < 0
        ) {

            newErrors.allowance =
                "Allowance cannot be negative";
        }


        if (
            formData.pf === "" ||
            Number(formData.pf) < 0
        ) {

            newErrors.pf =
                "PF cannot be negative";
        }


        if (
            formData.professional_tax === "" ||
            Number(formData.professional_tax) < 0
        ) {

            newErrors.professional_tax =
                "Professional tax cannot be negative";
        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        if (!validate()) {
            return;
        }


        const data = {

            employee_id:
                Number(formData.employee_id),

            basic_salary:
                Number(formData.basic_salary),

            hra:
                Number(formData.hra),

            allowance:
                Number(formData.allowance),

            pf:
                Number(formData.pf),

            professional_tax:
                Number(
                    formData.professional_tax
                ),
        };


        try {

            setSaving(true);


            if (selectedSalary) {

                await updateSalaryStructure(
                    selectedSalary.employee_id,
                    data
                );

                alert(
                    "Salary Updated Successfully"
                );

            } else {

                await createSalaryStructure(
                    data
                );

                alert(
                    "Salary Added Successfully"
                );
            }


            setDialogOpen(false);

            setSelectedSalary(null);

            await loadData();


        } catch (error) {

            console.error(
                "Salary operation failed:",
                error
            );


            alert(
                error.response?.data?.detail ||
                "Salary operation failed"
            );

        } finally {

            setSaving(false);
        }
    };


    // =====================================================
    // NET SALARY
    // =====================================================

    const calculateNetSalary = (salary) => {

        const gross =
            Number(salary.basic_salary || 0) +
            Number(salary.hra || 0) +
            Number(salary.allowance || 0);


        const deductions =
            Number(salary.pf || 0) +
            Number(
                salary.professional_tax || 0
            );


        return gross - deductions;
    };


    // =====================================================
    // FORMAT CURRENCY
    // =====================================================

    const formatCurrency = (amount) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(amount || 0);
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Box
                sx={{
                    minHeight: 400,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            sx={{
                p: {
                    xs: 2,
                    md: 4,
                },
                background:
                    "#faf3e3",
                minHeight: "100%",
            }}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        md: "center",
                    },
                    flexDirection: {
                        xs: "column",
                        md: "row",
                    },
                    gap: 2,
                    mb: 4,
                }}
            >

                <Box>

                    <Typography
                        sx={{
                            fontSize: {
                                xs: 30,
                                md: 38,
                            },
                            fontWeight: 700,
                            fontFamily:
                                "Playfair Display, Georgia, serif",
                            color: "#35241e",
                        }}
                    >
                        Salary
                    </Typography>

                    <Typography
                        sx={{
                            color: "#8a7568",
                            mt: 0.5,
                            fontSize: 15,
                        }}
                    >
                        Manage employee salary structures
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                    }}
                >

                    {/* Refresh */}

                    <Button
                        variant="outlined"
                        startIcon={
                            <RefreshIcon />
                        }
                        onClick={loadData}
                        sx={{
                            height: 44,
                            px: 2.5,
                            borderRadius: 2,
                            borderColor:
                                "#c9a86a",
                            color: "#6b4d32",
                            fontWeight: 700,
                            "&:hover": {
                                borderColor:
                                    "#a67c28",
                                background:
                                    "#fff8e8",
                            },
                        }}
                    >
                        Refresh
                    </Button>


                    {/* Add */}

                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        onClick={handleAdd}
                        sx={{
                            height: 44,
                            px: 2.5,
                            borderRadius: 2,
                            background:
                                "#dca62f",
                            color: "#2d211d",
                            fontWeight: 700,
                            boxShadow:
                                "0 4px 10px rgba(180,130,30,0.25)",
                            "&:hover": {
                                background:
                                    "#c89425",
                            },
                        }}
                    >
                        Add Salary
                    </Button>

                </Box>

            </Box>


            {/* ================================================= */}
            {/* SUMMARY */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, 1fr)",
                        lg: "repeat(3, 1fr)",
                    },
                    gap: 2,
                    mb: 3,
                }}
            >

                <Card
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid #eadfca",
                        boxShadow:
                            "0 4px 14px rgba(60,40,20,0.05)",
                    }}
                >

                    <Box sx={{ p: 2.5 }}>

                        <Typography
                            sx={{
                                color: "#8a7568",
                                fontSize: 14,
                            }}
                        >
                            Salary Structures
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 28,
                                fontWeight: 700,
                                color: "#35241e",
                                mt: 0.5,
                            }}
                        >
                            {salaryStructures.length}
                        </Typography>

                    </Box>

                </Card>


                <Card
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid #eadfca",
                        boxShadow:
                            "0 4px 14px rgba(60,40,20,0.05)",
                    }}
                >

                    <Box sx={{ p: 2.5 }}>

                        <Typography
                            sx={{
                                color: "#8a7568",
                                fontSize: 14,
                            }}
                        >
                            Total Gross Salary
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#35241e",
                                mt: 0.5,
                            }}
                        >
                            {formatCurrency(
                                salaryStructures.reduce(
                                    (
                                        total,
                                        salary
                                    ) =>
                                        total +
                                        Number(
                                            salary.basic_salary || 0
                                        ) +
                                        Number(
                                            salary.hra || 0
                                        ) +
                                        Number(
                                            salary.allowance || 0
                                        ),
                                    0
                                )
                            )}
                        </Typography>

                    </Box>

                </Card>


                <Card
                    sx={{
                        borderRadius: 3,
                        border:
                            "1px solid #eadfca",
                        boxShadow:
                            "0 4px 14px rgba(60,40,20,0.05)",
                    }}
                >

                    <Box sx={{ p: 2.5 }}>

                        <Typography
                            sx={{
                                color: "#8a7568",
                                fontSize: 14,
                            }}
                        >
                            Total Net Salary
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 24,
                                fontWeight: 700,
                                color: "#9a6a12",
                                mt: 0.5,
                            }}
                        >
                            {formatCurrency(
                                salaryStructures.reduce(
                                    (
                                        total,
                                        salary
                                    ) =>
                                        total +
                                        calculateNetSalary(
                                            salary
                                        ),
                                    0
                                )
                            )}
                        </Typography>

                    </Box>

                </Card>

            </Box>


            {/* ================================================= */}
            {/* SALARY TABLE */}
            {/* ================================================= */}

            <Card
                sx={{
                    borderRadius: 3,
                    border:
                        "1px solid #eadfca",
                    boxShadow:
                        "0 4px 16px rgba(60,40,20,0.06)",
                    overflow: "hidden",
                }}
            >

                <TableContainer>

                    <Table>

                        <TableHead>

                            <TableRow
                                sx={{
                                    background:
                                        "#fffdf8",
                                }}
                            >

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    Employee
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                    }}
                                >
                                    Basic Salary
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                    }}
                                >
                                    HRA
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                    }}
                                >
                                    Allowance
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                    }}
                                >
                                    PF
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                        whiteSpace:
                                            "nowrap",
                                    }}
                                >
                                    Professional Tax
                                </TableCell>

                                <TableCell
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                    }}
                                >
                                    Net Salary
                                </TableCell>

                                <TableCell
                                    align="center"
                                    sx={{
                                        fontWeight: 700,
                                        color: "#35241e",
                                    }}
                                >
                                    Actions
                                </TableCell>

                            </TableRow>

                        </TableHead>


                        <TableBody>

                            {salaryStructures.length === 0 ? (

                                <TableRow>

                                    <TableCell
                                        colSpan={8}
                                        align="center"
                                        sx={{
                                            py: 6,
                                            color:
                                                "#8a7568",
                                        }}
                                    >

                                        <AccountBalanceWalletIcon
                                            sx={{
                                                fontSize: 42,
                                                opacity: 0.45,
                                                mb: 1,
                                            }}
                                        />

                                        <Typography>
                                            No salary structures found
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                mt: 0.5,
                                            }}
                                        >
                                            Click "Add Salary" to create one.
                                        </Typography>

                                    </TableCell>

                                </TableRow>

                            ) : (

                                salaryStructures.map(
                                    (salary) => {

                                        const employee =
                                            getEmployee(
                                                salary.employee_id
                                            );

                                        const netSalary =
                                            calculateNetSalary(
                                                salary
                                            );


                                        return (

                                            <TableRow
                                                key={
                                                    salary.id
                                                }
                                                hover
                                            >

                                                {/* Employee */}

                                                <TableCell>

                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            color:
                                                                "#35241e",
                                                        }}
                                                    >
                                                        {employee?.full_name ||
                                                            `Employee ${salary.employee_id}`}
                                                    </Typography>

                                                    <Typography
                                                        sx={{
                                                            fontSize: 12,
                                                            color:
                                                                "#8a7568",
                                                            mt: 0.3,
                                                        }}
                                                    >
                                                        EMP
                                                        {String(
                                                            salary.employee_id
                                                        ).padStart(
                                                            3,
                                                            "0"
                                                        )}
                                                    </Typography>

                                                </TableCell>


                                                {/* Basic */}

                                                <TableCell>

                                                    {formatCurrency(
                                                        salary.basic_salary
                                                    )}

                                                </TableCell>


                                                {/* HRA */}

                                                <TableCell>

                                                    {formatCurrency(
                                                        salary.hra
                                                    )}

                                                </TableCell>


                                                {/* Allowance */}

                                                <TableCell>

                                                    {formatCurrency(
                                                        salary.allowance
                                                    )}

                                                </TableCell>


                                                {/* PF */}

                                                <TableCell>

                                                    {formatCurrency(
                                                        salary.pf
                                                    )}

                                                </TableCell>


                                                {/* Professional Tax */}

                                                <TableCell>

                                                    {formatCurrency(
                                                        salary.professional_tax
                                                    )}

                                                </TableCell>


                                                {/* Net */}

                                                <TableCell>

                                                    <Typography
                                                        sx={{
                                                            fontWeight: 700,
                                                            color:
                                                                "#9a6a12",
                                                        }}
                                                    >
                                                        {formatCurrency(
                                                            netSalary
                                                        )}
                                                    </Typography>

                                                </TableCell>


                                                {/* Actions */}

                                                <TableCell
                                                    align="center"
                                                >

                                                    <Button
                                                        size="small"
                                                        startIcon={
                                                            <EditIcon />
                                                        }
                                                        onClick={() =>
                                                            handleEdit(
                                                                salary
                                                            )
                                                        }
                                                        sx={{
                                                            minWidth:
                                                                "auto",
                                                            color:
                                                                "#c89425",
                                                            fontWeight:
                                                                700,
                                                            "&:hover": {
                                                                background:
                                                                    "#fff7df",
                                                            },
                                                        }}
                                                    >
                                                        Edit
                                                    </Button>

                                                </TableCell>

                                            </TableRow>

                                        );

                                    }
                                )

                            )}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Card>


            {/* ================================================= */}
            {/* ADD / EDIT DIALOG */}
            {/* ================================================= */}

            <Dialog
                open={dialogOpen}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700,
                        fontFamily:
                            "Playfair Display, Georgia, serif",
                        fontSize: 26,
                        color: "#35241e",
                    }}
                >
                    {selectedSalary
                        ? "Edit Salary"
                        : "Add Salary"}
                </DialogTitle>


                <DialogContent>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                            mt: 1,
                        }}
                    >

                        {/* Employee */}

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
                                Boolean(
                                    selectedSalary
                                )
                            }
                            error={
                                Boolean(
                                    errors.employee_id
                                )
                            }
                            helperText={
                                errors.employee_id ||
                                "Select employee"
                            }
                        >

                            <MenuItem value="">
                                Select Employee
                            </MenuItem>

                            {availableEmployees.map(
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
                                        {" — EMP"}
                                        {String(
                                            employee.id
                                        ).padStart(
                                            3,
                                            "0"
                                        )}
                                    </MenuItem>

                                )
                            )}

                        </TextField>


                        {/* Basic Salary */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Basic Salary"
                            name="basic_salary"
                            value={
                                formData.basic_salary
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                            }}
                            error={
                                Boolean(
                                    errors.basic_salary
                                )
                            }
                            helperText={
                                errors.basic_salary ||
                                "Monthly basic salary"
                            }
                        />


                        {/* HRA */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="HRA"
                            name="hra"
                            value={
                                formData.hra
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                            }}
                            error={
                                Boolean(
                                    errors.hra
                                )
                            }
                            helperText={
                                errors.hra ||
                                "House Rent Allowance"
                            }
                        />


                        {/* Allowance */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Allowance"
                            name="allowance"
                            value={
                                formData.allowance
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                            }}
                            error={
                                Boolean(
                                    errors.allowance
                                )
                            }
                            helperText={
                                errors.allowance ||
                                "Other monthly allowances"
                            }
                        />


                        {/* PF */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="PF"
                            name="pf"
                            value={
                                formData.pf
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                            }}
                            error={
                                Boolean(
                                    errors.pf
                                )
                            }
                            helperText={
                                errors.pf ||
                                "Provident Fund deduction"
                            }
                        />


                        {/* Professional Tax */}

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Professional Tax"
                            name="professional_tax"
                            value={
                                formData.professional_tax
                            }
                            onChange={
                                handleChange
                            }
                            inputProps={{
                                min: 0,
                            }}
                            error={
                                Boolean(
                                    errors.professional_tax
                                )
                            }
                            helperText={
                                errors.professional_tax ||
                                "Monthly professional tax"
                            }
                        />

                    </Box>


                    {/* PREVIEW */}

                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            background:
                                "#fff8e8",
                            border:
                                "1px solid #eadfca",
                        }}
                    >

                        <Typography
                            sx={{
                                fontWeight: 700,
                                color: "#35241e",
                                mb: 1,
                            }}
                        >
                            Salary Preview
                        </Typography>


                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "space-between",
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >

                            <Typography
                                sx={{
                                    color: "#6f5a4d",
                                }}
                            >
                                Gross:{" "}
                                <strong>
                                    {formatCurrency(
                                        Number(
                                            formData.basic_salary || 0
                                        ) +
                                        Number(
                                            formData.hra || 0
                                        ) +
                                        Number(
                                            formData.allowance || 0
                                        )
                                    )}
                                </strong>
                            </Typography>


                            <Typography
                                sx={{
                                    color: "#6f5a4d",
                                }}
                            >
                                Deductions:{" "}
                                <strong>
                                    {formatCurrency(
                                        Number(
                                            formData.pf || 0
                                        ) +
                                        Number(
                                            formData.professional_tax || 0
                                        )
                                    )}
                                </strong>
                            </Typography>


                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: "#9a6a12",
                                }}
                            >
                                Net Salary:{" "}
                                {formatCurrency(
                                    Number(
                                        formData.basic_salary || 0
                                    ) +
                                    Number(
                                        formData.hra || 0
                                    ) +
                                    Number(
                                        formData.allowance || 0
                                    ) -
                                    Number(
                                        formData.pf || 0
                                    ) -
                                    Number(
                                        formData.professional_tax || 0
                                    )
                                )}
                            </Typography>

                        </Box>

                    </Box>

                </DialogContent>


                <DialogActions
                    sx={{
                        px: 3,
                        pb: 3,
                        gap: 1,
                    }}
                >

                    <Button
                        onClick={handleClose}
                        disabled={saving}
                        sx={{
                            color: "#8a651b",
                            fontWeight: 700,
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving}
                        startIcon={
                            saving
                                ? <CircularProgress
                                    size={18}
                                  />
                                : null
                        }
                        sx={{
                            background:
                                "#dca62f",
                            color: "#2d211d",
                            fontWeight: 700,
                            px: 3,
                            "&:hover": {
                                background:
                                    "#c89425",
                            },
                        }}
                    >
                        {saving
                            ? "Saving..."
                            : selectedSalary
                                ? "UPDATE SALARY"
                                : "SAVE SALARY"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}


export default SalaryPage;