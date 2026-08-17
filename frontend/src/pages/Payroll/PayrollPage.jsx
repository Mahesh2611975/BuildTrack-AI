import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";

import CalculateIcon from "@mui/icons-material/Calculate";
import DownloadIcon from "@mui/icons-material/Download";

import api from "../../services/api";
import { getPayroll } from "../../services/payrollService";
import SaveIcon from "@mui/icons-material/Save";

function PayrollPage() {

    const [employees, setEmployees] = useState([]);

    const [employeeId, setEmployeeId] = useState("");

    const [year, setYear] = useState(
        new Date().getFullYear()
    );

    const [month, setMonth] = useState(
        new Date().getMonth() + 1
    );

    const [payroll, setPayroll] = useState(null);

    const [loading, setLoading] = useState(false);

    const [downloading, setDownloading] = useState(false);


    // =====================================================
    // LOAD EMPLOYEES
    // =====================================================

    useEffect(() => {

        const fetchEmployees = async () => {

            try {

                const response = await api.get(
                    "/employees"
                );

                setEmployees(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load employees:",
                    error
                );

            }

        };

        fetchEmployees();

    }, []);


    // =====================================================
    // GENERATE PAYROLL
    // =====================================================

    const handleGeneratePayroll = async () => {

        if (!employeeId) {

            alert(
                "Please select an employee"
            );

            return;
        }

        try {

            setLoading(true);

            const response = await getPayroll(
                employeeId,
                year,
                month
            );

            setPayroll(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to generate payroll:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to generate payroll"
            );

            setPayroll(null);

        } finally {

            setLoading(false);

        }
    };
    const handleSavePayroll = async () => {
        if (!payroll) {
            alert("Please generate payroll first");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                `/payroll/save?employee_id=${employeeId}&year=${year}&month=${month}`
            );

            alert(
                response.data?.message ||
                "Payroll saved successfully"
            );

        } catch (error) {

            console.error(
                "Failed to save payroll:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to save payroll"
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DOWNLOAD PAYSLIP
    // =====================================================

    const handleDownloadPayslip = async () => {

        if (!employeeId) {

            alert(
                "Please select an employee"
            );

            return;
        }

        if (!payroll) {

            alert(
                "Please generate payroll first"
            );

            return;
        }

        try {

            setDownloading(true);

            const response = await api.get(
                `/payroll/${employeeId}/${year}/${month}/payslip`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `payslip_${payroll.employee_id}_${year}_${month}.pdf`;

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);

        } catch (error) {

            console.error(
                "Failed to download payslip:",
                error
            );

            alert(
                "Failed to download payslip"
            );

        } finally {

            setDownloading(false);

        }
    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <Box sx={{ p: 3 }}>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                }}
            >

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight="600"
                    >
                        Payroll
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Generate and manage employee payroll
                    </Typography>

                </Box>

            </Box>


            {/* ================================================= */}
            {/* PAYROLL FILTER */}
            {/* ================================================= */}

            <Card sx={{ mb: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ mb: 2 }}
                    >
                        Generate Payroll
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        {/* ================================================= */}
                        {/* EMPLOYEE */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <FormControl
                                fullWidth
                            >

                                <InputLabel>
                                    Employee
                                </InputLabel>

                                <Select
                                    value={employeeId}
                                    label="Employee"
                                    onChange={(e) => {

                                        setEmployeeId(
                                            e.target.value
                                        );

                                        setPayroll(null);
                                    }}
                                >

                                    {employees.map(
                                        (employee) => (

                                            <MenuItem
                                                key={
                                                    employee.id
                                                }
                                                value={
                                                    employee.id
                                                }
                                            >

                                                {
                                                    employee.employee_id
                                                }

                                                {" - "}

                                                {
                                                    employee.full_name
                                                }

                                            </MenuItem>

                                        )
                                    )}

                                </Select>

                            </FormControl>

                        </Grid>


                        {/* ================================================= */}
                        {/* YEAR */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <FormControl
                                fullWidth
                            >

                                <InputLabel>
                                    Year
                                </InputLabel>

                                <Select
                                    value={year}
                                    label="Year"
                                    onChange={(e) => {

                                        setYear(
                                            e.target.value
                                        );

                                        setPayroll(null);
                                    }}
                                >

                                    <MenuItem value={2026}>
                                        2026
                                    </MenuItem>

                                    <MenuItem value={2025}>
                                        2025
                                    </MenuItem>

                                    <MenuItem value={2024}>
                                        2024
                                    </MenuItem>

                                </Select>

                            </FormControl>

                        </Grid>


                        {/* ================================================= */}
                        {/* MONTH */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <FormControl
                                fullWidth
                            >

                                <InputLabel>
                                    Month
                                </InputLabel>

                                <Select
                                    value={month}
                                    label="Month"
                                    onChange={(e) => {

                                        setMonth(
                                            e.target.value
                                        );

                                        setPayroll(null);
                                    }}
                                >

                                    <MenuItem value={1}>
                                        January
                                    </MenuItem>

                                    <MenuItem value={2}>
                                        February
                                    </MenuItem>

                                    <MenuItem value={3}>
                                        March
                                    </MenuItem>

                                    <MenuItem value={4}>
                                        April
                                    </MenuItem>

                                    <MenuItem value={5}>
                                        May
                                    </MenuItem>

                                    <MenuItem value={6}>
                                        June
                                    </MenuItem>

                                    <MenuItem value={7}>
                                        July
                                    </MenuItem>

                                    <MenuItem value={8}>
                                        August
                                    </MenuItem>

                                    <MenuItem value={9}>
                                        September
                                    </MenuItem>

                                    <MenuItem value={10}>
                                        October
                                    </MenuItem>

                                    <MenuItem value={11}>
                                        November
                                    </MenuItem>

                                    <MenuItem value={12}>
                                        December
                                    </MenuItem>

                                </Select>

                            </FormControl>

                        </Grid>


                        {/* ================================================= */}
                        {/* GENERATE BUTTON */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={2}
                        >

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={
                                    <CalculateIcon />
                                }
                                onClick={
                                    handleGeneratePayroll
                                }
                                disabled={loading}
                                sx={{
                                    height: "56px",
                                }}
                            >

                                {loading
                                    ? "Generating..."
                                    : "Generate"}

                            </Button>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* PAYROLL RESULT */}
            {/* ================================================= */}

            {payroll && (

                <>

                    {/* ================================================= */}
                    {/* EMPLOYEE INFORMATION */}
                    {/* ================================================= */}

                    <Card sx={{ mb: 3 }}>

                        <CardContent>

                            <Typography
                                variant="h5"
                                fontWeight="600"
                            >
                                {
                                    payroll.employee_name
                                }
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Employee ID:{" "}
                                {
                                    payroll.employee_id
                                }
                            </Typography>

                            <Typography
                                color="text.secondary"
                            >
                                Payroll Period:{" "}
                                {
                                    payroll.month
                                }
                                /
                                {
                                    payroll.year
                                }
                            </Typography>

                        </CardContent>

                    </Card>


                    <Grid
                        container
                        spacing={3}
                    >

                        {/* ================================================= */}
                        {/* ATTENDANCE */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Card>

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="600"
                                        sx={{ mb: 2 }}
                                    >
                                        Attendance Summary
                                    </Typography>

                                    <Typography>
                                        Working Days:{" "}
                                        {
                                            payroll.total_working_days
                                        }
                                    </Typography>

                                    <Typography>
                                        Present Days:{" "}
                                        {
                                            payroll.present_days
                                        }
                                    </Typography>

                                    <Typography>
                                        Half Days:{" "}
                                        {
                                            payroll.half_days
                                        }
                                    </Typography>

                                    <Typography>
                                        Absent Days:{" "}
                                        {
                                            payroll.absent_days
                                        }
                                    </Typography>

                                    <Typography>
                                        Leave Days:{" "}
                                        {
                                            payroll.leave_days
                                        }
                                    </Typography>

                                    <Typography
                                        fontWeight="600"
                                        sx={{ mt: 1 }}
                                    >
                                        Paid Days:{" "}
                                        {
                                            payroll.paid_days
                                        }
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>


                        {/* ================================================= */}
                        {/* SALARY */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Card>

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="600"
                                        sx={{ mb: 2 }}
                                    >
                                        Salary Details
                                    </Typography>

                                    <Typography>
                                        Basic Salary: ₹
                                        {
                                            payroll.basic_salary
                                        }
                                    </Typography>

                                    <Typography>
                                        HRA: ₹
                                        {
                                            payroll.hra
                                        }
                                    </Typography>

                                    <Typography>
                                        Allowance: ₹
                                        {
                                            payroll.allowance
                                        }
                                    </Typography>

                                    <Typography
                                        fontWeight="600"
                                        sx={{ mt: 1 }}
                                    >
                                        Gross Salary: ₹
                                        {
                                            payroll.gross_salary
                                        }
                                    </Typography>

                                    <Typography>
                                        Daily Salary: ₹
                                        {
                                            payroll.daily_salary
                                        }
                                    </Typography>

                                    <Typography>
                                        Earned Salary: ₹
                                        {
                                            payroll.earned_salary
                                        }
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>


                        {/* ================================================= */}
                        {/* DEDUCTIONS */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Card>

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="600"
                                        sx={{ mb: 2 }}
                                    >
                                        Deductions
                                    </Typography>

                                    <Typography>
                                        PF: ₹
                                        {
                                            payroll.pf
                                        }
                                    </Typography>

                                    <Typography>
                                        Professional Tax: ₹
                                        {
                                            payroll.professional_tax
                                        }
                                    </Typography>

                                    <Typography>
                                        Advance Deduction: ₹
                                        {
                                            payroll.advance_deduction || 0
                                        }
                                    </Typography>

                                    <Typography
                                        fontWeight="600"
                                        sx={{ mt: 1 }}
                                    >
                                        Total Deductions: ₹
                                        {
                                            payroll.total_deductions
                                        }
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>


                        {/* ================================================= */}
                        {/* NET SALARY */}
                        {/* ================================================= */}

                        <Grid
                            item
                            xs={12}
                            md={6}
                        >

                            <Card>

                                <CardContent>

                                    <Typography
                                        variant="h6"
                                        fontWeight="600"
                                        sx={{ mb: 2 }}
                                    >
                                        Net Salary
                                    </Typography>

                                    <Typography
                                        variant="h4"
                                        fontWeight="700"
                                        sx={{ mb: 2 }}
                                    >
                                        ₹
                                        {
                                            payroll.net_salary
                                        }
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<SaveIcon />}
                                        onClick={handleSavePayroll}
                                        disabled={loading}
                                        sx={{ mb: 2 }}
                                    >
                                        {loading ? "Saving..." : "Save Payroll"}
                                    </Button>
                                    {/* DOWNLOAD PAYSLIP */}

                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        startIcon={
                                            <DownloadIcon />
                                        }
                                        onClick={
                                            handleDownloadPayslip
                                        }
                                        disabled={
                                            downloading
                                        }
                                    >

                                        {downloading
                                            ? "Downloading..."
                                            : "Download Payslip"}

                                    </Button>

                                </CardContent>

                            </Card>

                        </Grid>

                    </Grid>

                </>

            )}

        </Box>
    );
}

export default PayrollPage;