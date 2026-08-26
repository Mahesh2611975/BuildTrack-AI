import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";

import CalculateIcon from "@mui/icons-material/Calculate";
import DownloadIcon from "@mui/icons-material/Download";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

import api from "../../services/api";

import {
    getPayroll,
    savePayroll,
    downloadPayslip,
} from "../../services/payrollService";


// ============================================================
// COLORS
// ============================================================

const COLORS = {
    bg: "#f8f0df",
    brown: "#3b2823",
    muted: "#8a7568",
    gold: "#dda625",
    goldDark: "#bd8616",
    border: "#eadfca",
    soft: "#fff7e7",
    green: "#2e7d32",
    red: "#c62828",
};


// ============================================================
// MONEY FORMAT
// ============================================================

const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;


// ============================================================
// MONTH NAME
// ============================================================

const monthName = (month) =>
    new Date(
        2000,
        Number(month) - 1,
        1
    ).toLocaleString("en-IN", {
        month: "long",
    });


// ============================================================
// DETAIL ROW
// ============================================================

function DetailRow({
    label,
    value,
    strong = false,
}) {

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                gap: 2,
                py: 0.75,
            }}
        >

            <Typography
                sx={{
                    color: COLORS.muted,
                    fontSize: 14,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    color: COLORS.brown,
                    fontSize: 14,
                    fontWeight: strong ? 800 : 500,
                    textAlign: "right",
                }}
            >
                {value}
            </Typography>

        </Box>
    );
}


// ============================================================
// INFO BOX
// ============================================================

function InfoBox({
    label,
    value,
}) {

    return (
        <Box
            sx={{
                p: 1.5,
                borderRadius: 2,
                background: "#fffaf0",
                border: `1px solid ${COLORS.border}`,
            }}
        >

            <Typography
                sx={{
                    fontSize: 12,
                    color: COLORS.muted,
                }}
            >
                {label}
            </Typography>

            <Typography
                sx={{
                    mt: 0.4,
                    fontWeight: 700,
                    color: COLORS.brown,
                }}
            >
                {value}
            </Typography>

        </Box>
    );
}


// ============================================================
// SECTION CARD
// ============================================================

function SectionCard({
    title,
    children,
}) {

    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`,
                boxShadow:
                    "0 5px 18px rgba(60,40,20,0.06)",
            }}
        >

            <CardContent
                sx={{
                    p: {
                        xs: 2.5,
                        md: 3,
                    },
                }}
            >

                <Typography
                    sx={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: COLORS.brown,
                        mb: 2,
                    }}
                >
                    {title}
                </Typography>

                {children}

            </CardContent>

        </Card>
    );
}


// ============================================================
// PAYROLL PAGE
// ============================================================

function PayrollPage() {

    const [employees, setEmployees] =
        useState([]);

    const [employeeId, setEmployeeId] =
        useState("");

    const [year, setYear] =
        useState(
            new Date().getFullYear()
        );

    const [month, setMonth] =
        useState(
            new Date().getMonth() + 1
        );

    const [payroll, setPayroll] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [downloading, setDownloading] =
        useState(false);

    const [employeesLoading, setEmployeesLoading] =
        useState(true);


    // ============================================================
    // LOAD EMPLOYEES
    // ============================================================

    const loadEmployees = async () => {

        try {

            setEmployeesLoading(true);

            const response =
                await api.get("/employees");

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

            alert(
                error.response?.data?.detail ||
                "Failed to load employees"
            );

        } finally {

            setEmployeesLoading(false);

        }
    };


    // ============================================================
    // INITIAL LOAD
    // ============================================================

    useEffect(() => {

        loadEmployees();

    }, []);


    // ============================================================
    // GENERATE PAYROLL
    // ============================================================

    const handleGeneratePayroll = async () => {

        if (!employeeId) {

            alert(
                "Please select an employee"
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await getPayroll(
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


    // ============================================================
    // SAVE PAYROLL
    // ============================================================

    const handleSavePayroll = async () => {

        if (!payroll) {

            alert(
                "Please generate payroll first"
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await savePayroll(
                    employeeId,
                    year,
                    month
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


    // ============================================================
    // DOWNLOAD PAYSLIP
    // ============================================================

    const handleDownloadPayslip = async () => {

        if (!payroll) {

            alert(
                "Please generate payroll first"
            );

            return;
        }

        try {

            setDownloading(true);

            const response =
                await downloadPayslip(
                    employeeId,
                    year,
                    month
                );

            const blob =
                new Blob(
                    [response.data],
                    {
                        type: "application/pdf",
                    }
                );

            const url =
                window.URL.createObjectURL(
                    blob
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `payslip_${payroll.employee_id}_${year}_${month}.pdf`;

            document.body.appendChild(
                link
            );

            link.click();

            document.body.removeChild(
                link
            );

            window.URL.revokeObjectURL(
                url
            );

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


    // ============================================================
    // REFRESH
    // ============================================================

    const handleRefresh = async () => {

        setPayroll(null);

        await loadEmployees();

    };


    // ============================================================
    // UI
    // ============================================================

    return (

        <Box
            sx={{
                minHeight: "100%",
                background: COLORS.bg,
                p: {
                    xs: 2,
                    md: 4,
                },
            }}
        >

            {/* ==================================================
                HEADER
            ================================================== */}

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
                                xs: 34,
                                md: 42,
                            },
                            lineHeight: 1.1,
                            fontWeight: 700,
                            fontFamily:
                                "Playfair Display, Georgia, serif",
                            color: COLORS.brown,
                        }}
                    >
                        Payroll
                    </Typography>

                    <Typography
                        sx={{
                            color: COLORS.muted,
                            mt: 0.8,
                        }}
                    >
                        Generate and manage employee payroll
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1.5,
                        flexWrap: "wrap",
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <RefreshIcon />
                        }
                        onClick={
                            handleRefresh
                        }
                        disabled={
                            employeesLoading ||
                            loading
                        }
                        sx={{
                            minHeight: 46,
                            px: 2.5,
                            borderRadius: 2.5,
                            borderColor:
                                COLORS.goldDark,
                            color:
                                COLORS.brown,
                            fontWeight: 700,
                            textTransform:
                                "none",
                        }}
                    >
                        Refresh
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <PaymentsIcon />
                        }
                        onClick={() =>
                            document
                                .getElementById(
                                    "payroll-generator"
                                )
                                ?.scrollIntoView({
                                    behavior:
                                        "smooth",
                                })
                        }
                        sx={{
                            minHeight: 46,
                            px: 2.8,
                            borderRadius: 2.5,
                            background:
                                "linear-gradient(135deg, #dda625, #c89425)",
                            color:
                                COLORS.brown,
                            fontWeight: 800,
                            textTransform:
                                "none",
                            boxShadow:
                                "0 5px 14px rgba(160,110,20,0.18)",
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #c89425, #b58218)",
                            },
                        }}
                    >
                        Generate Payroll
                    </Button>

                </Box>

            </Box>


            {/* ==================================================
                PAYROLL GENERATOR
            ================================================== */}

            <Card
                id="payroll-generator"
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border:
                        `1px solid ${COLORS.border}`,
                    boxShadow:
                        "0 5px 18px rgba(60,40,20,0.06)",
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
                            md: 3,
                        },
                    }}
                >

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                            mb: 2.5,
                        }}
                    >

                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent:
                                    "center",
                                background:
                                    COLORS.soft,
                                color:
                                    COLORS.goldDark,
                            }}
                        >
                            <CalculateIcon />
                        </Box>

                        <Box>

                            <Typography
                                sx={{
                                    fontSize: 21,
                                    fontWeight: 700,
                                    color:
                                        COLORS.brown,
                                }}
                            >
                                Generate Payroll
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color:
                                        COLORS.muted,
                                }}
                            >
                                Select employee and payroll period
                            </Typography>

                        </Box>

                    </Box>


                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                    >

                        {/* EMPLOYEE */}

                        <Grid
                            item
                            xs={12}
                            md={5}
                        >

                            <FormControl
                                fullWidth
                                disabled={
                                    employeesLoading ||
                                    loading
                                }
                            >

                                <InputLabel>
                                    Employee
                                </InputLabel>

                                <Select
                                    value={
                                        employeeId
                                    }
                                    label="Employee"
                                    onChange={(e) => {

                                        setEmployeeId(
                                            e.target.value
                                        );

                                        setPayroll(
                                            null
                                        );

                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        background:
                                            "#fffdfa",
                                    }}
                                >

                                    <MenuItem value="">
                                        Select Employee
                                    </MenuItem>

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


                        {/* YEAR */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                        >

                            <FormControl
                                fullWidth
                                disabled={loading}
                            >

                                <InputLabel>
                                    Year
                                </InputLabel>

                                <Select
                                    value={year}
                                    label="Year"
                                    onChange={(e) => {

                                        setYear(
                                            Number(
                                                e.target.value
                                            )
                                        );

                                        setPayroll(
                                            null
                                        );

                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        background:
                                            "#fffdfa",
                                    }}
                                >

                                    {[
                                        year + 1,
                                        year,
                                        year - 1,
                                        year - 2,
                                    ].map(
                                        (item) => (

                                            <MenuItem
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </MenuItem>

                                        )
                                    )}

                                </Select>

                            </FormControl>

                        </Grid>


                        {/* MONTH */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                        >

                            <FormControl
                                fullWidth
                                disabled={loading}
                            >

                                <InputLabel>
                                    Month
                                </InputLabel>

                                <Select
                                    value={month}
                                    label="Month"
                                    onChange={(e) => {

                                        setMonth(
                                            Number(
                                                e.target.value
                                            )
                                        );

                                        setPayroll(
                                            null
                                        );

                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        background:
                                            "#fffdfa",
                                    }}
                                >

                                    {Array.from(
                                        {
                                            length: 12,
                                        },
                                        (_, index) => {

                                            const value =
                                                index + 1;

                                            return (

                                                <MenuItem
                                                    key={
                                                        value
                                                    }
                                                    value={
                                                        value
                                                    }
                                                >
                                                    {
                                                        monthName(
                                                            value
                                                        )
                                                    }
                                                </MenuItem>

                                            );

                                        }
                                    )}

                                </Select>

                            </FormControl>

                        </Grid>


                        {/* GENERATE BUTTON */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={20}
                                            sx={{
                                                color:
                                                    COLORS.brown,
                                            }}
                                        />
                                    ) : (
                                        <CalculateIcon />
                                    )
                                }
                                onClick={
                                    handleGeneratePayroll
                                }
                                disabled={
                                    loading ||
                                    employeesLoading
                                }
                                sx={{
                                    height: 56,
                                    borderRadius: 2,
                                    background:
                                        "linear-gradient(135deg, #dda625, #c89425)",
                                    color:
                                        COLORS.brown,
                                    fontWeight: 800,
                                    textTransform:
                                        "none",
                                    "&:hover": {
                                        background:
                                            "linear-gradient(135deg, #c89425, #b58218)",
                                    },
                                }}
                            >
                                {
                                    loading
                                        ? "Processing..."
                                        : "Generate Payroll"
                                }
                            </Button>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================================
                EMPTY STATE
            ================================================== */}

            {!payroll &&
                !loading && (

                    <Card
                        sx={{
                            borderRadius: 3,
                            border:
                                `1px solid ${COLORS.border}`,
                            boxShadow:
                                "0 5px 18px rgba(60,40,20,0.05)",
                        }}
                    >

                        <CardContent
                            sx={{
                                py: 7,
                                textAlign: "center",
                            }}
                        >

                            <Box
                                sx={{
                                    width: 64,
                                    height: 64,
                                    borderRadius: "50%",
                                    mx: "auto",
                                    mb: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent:
                                        "center",
                                    background:
                                        COLORS.soft,
                                    color:
                                        COLORS.goldDark,
                                }}
                            >
                                <CalendarMonthIcon
                                    sx={{
                                        fontSize: 30,
                                    }}
                                />
                            </Box>

                            <Typography
                                sx={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color:
                                        COLORS.brown,
                                }}
                            >
                                No Payroll Generated
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.7,
                                    color:
                                        COLORS.muted,
                                }}
                            >
                                Select an employee, year and month above to calculate payroll.
                            </Typography>

                        </CardContent>

                    </Card>

                )}


            {/* ==================================================
                PAYROLL RESULT
            ================================================== */}

            {payroll && (

                <>

                    {/* EMPLOYEE HEADER */}

                    <Card
                        sx={{
                            mb: 3,
                            borderRadius: 3,
                            border:
                                `1px solid ${COLORS.border}`,
                            boxShadow:
                                "0 5px 18px rgba(60,40,20,0.05)",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: {
                                    xs: 2.5,
                                    md: 3,
                                },
                            }}
                        >

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: {
                                        xs: "flex-start",
                                        sm: "center",
                                    },
                                    flexDirection: {
                                        xs: "column",
                                        sm: "row",
                                    },
                                    gap: 2,
                                }}
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 28,
                                            fontWeight: 700,
                                            color:
                                                COLORS.brown,
                                        }}
                                    >
                                        {
                                            payroll.employee_name
                                        }
                                    </Typography>

                                    <Typography
                                        sx={{
                                            color:
                                                COLORS.muted,
                                            mt: 0.3,
                                        }}
                                    >
                                        Employee ID:{" "}
                                        <strong>
                                            {
                                                payroll.employee_id
                                            }
                                        </strong>
                                    </Typography>

                                </Box>


                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 1,
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        background:
                                            COLORS.soft,
                                        color:
                                            COLORS.brown,
                                    }}
                                >

                                    <CalendarMonthIcon
                                        sx={{
                                            fontSize: 19,
                                        }}
                                    />

                                    <Typography
                                        fontWeight={700}
                                    >
                                        {
                                            monthName(
                                                payroll.month
                                            )
                                        }{" "}
                                        {
                                            payroll.year
                                        }
                                    </Typography>

                                </Box>

                            </Box>

                        </CardContent>

                    </Card>


                    {/* ==================================================
                        SUMMARY CARDS
                    ================================================== */}

                    <Grid
                        container
                        spacing={2}
                        sx={{
                            mb: 3,
                        }}
                    >

                        {/* WORKING DAYS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <SectionCard
                                title="Working Days"
                            >

                                <Typography
                                    sx={{
                                        fontSize: 30,
                                        fontWeight: 800,
                                        color:
                                            COLORS.brown,
                                    }}
                                >
                                    {
                                        payroll.total_working_days
                                    }
                                </Typography>

                                <Typography
                                    fontSize={13}
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Paid days:{" "}
                                    {
                                        payroll.paid_days
                                    }
                                </Typography>

                            </SectionCard>

                        </Grid>


                        {/* GROSS SALARY */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <SectionCard
                                title="Gross Salary"
                            >

                                <Typography
                                    sx={{
                                        fontSize: 30,
                                        fontWeight: 800,
                                        color:
                                            COLORS.brown,
                                    }}
                                >
                                    {
                                        money(
                                            payroll.gross_salary
                                        )
                                    }
                                </Typography>

                                <Typography
                                    fontSize={13}
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Earned:{" "}
                                    {
                                        money(
                                            payroll.earned_salary
                                        )
                                    }
                                </Typography>

                            </SectionCard>

                        </Grid>


                        {/* TOTAL DEDUCTIONS */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <SectionCard
                                title="Total Deductions"
                            >

                                <Typography
                                    sx={{
                                        fontSize: 30,
                                        fontWeight: 800,
                                        color:
                                            COLORS.red,
                                    }}
                                >
                                    {
                                        money(
                                            payroll.total_deductions
                                        )
                                    }
                                </Typography>

                                <Typography
                                    fontSize={13}
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    PF + tax + salary advance
                                </Typography>

                            </SectionCard>

                        </Grid>


                        {/* NET SALARY */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                        >

                            <Card
                                sx={{
                                    height: "100%",
                                    borderRadius: 3,
                                    background:
                                        "linear-gradient(135deg,#fff7e7,#fffdf8)",
                                    border:
                                        `1px solid ${COLORS.border}`,
                                    boxShadow:
                                        "0 4px 14px rgba(60,40,20,0.05)",
                                }}
                            >

                                <CardContent>

                                    <Typography
                                        fontSize={14}
                                        color={
                                            COLORS.muted
                                        }
                                    >
                                        Net Salary
                                    </Typography>

                                    <Typography
                                        sx={{
                                            mt: 1,
                                            fontSize: 30,
                                            fontWeight: 800,
                                            color:
                                                COLORS.goldDark,
                                        }}
                                    >
                                        {
                                            money(
                                                payroll.net_salary
                                            )
                                        }
                                    </Typography>

                                    <Typography
                                        fontSize={13}
                                        color={
                                            COLORS.muted
                                        }
                                    >
                                        Final payable amount
                                    </Typography>

                                </CardContent>

                            </Card>

                        </Grid>

                    </Grid>


                    {/* ==================================================
                        DETAILS
                    ================================================== */}

                    <Grid
                        container
                        spacing={3}
                    >

                        {/* ATTENDANCE */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <SectionCard
                                title="Attendance Summary"
                            >

                                <DetailRow
                                    label="Working Days"
                                    value={
                                        payroll.total_working_days
                                    }
                                />

                                <DetailRow
                                    label="Present Days"
                                    value={
                                        payroll.present_days
                                    }
                                />

                                <DetailRow
                                    label="Half Days"
                                    value={
                                        payroll.half_days
                                    }
                                />

                                <DetailRow
                                    label="Absent Days"
                                    value={
                                        payroll.absent_days
                                    }
                                />

                                <DetailRow
                                    label="Leave Days"
                                    value={
                                        payroll.leave_days
                                    }
                                />

                                <Divider
                                    sx={{
                                        my: 1.2,
                                        borderColor:
                                            COLORS.border,
                                    }}
                                />

                                <DetailRow
                                    label="Paid Days"
                                    value={
                                        payroll.paid_days
                                    }
                                    strong
                                />

                            </SectionCard>

                        </Grid>


                        {/* SALARY DETAILS */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <SectionCard
                                title="Salary Details"
                            >

                                <DetailRow
                                    label="Basic Salary"
                                    value={
                                        money(
                                            payroll.basic_salary
                                        )
                                    }
                                />

                                <DetailRow
                                    label="HRA"
                                    value={
                                        money(
                                            payroll.hra
                                        )
                                    }
                                />

                                <DetailRow
                                    label="Allowance"
                                    value={
                                        money(
                                            payroll.allowance
                                        )
                                    }
                                />

                                <Divider
                                    sx={{
                                        my: 1.2,
                                        borderColor:
                                            COLORS.border,
                                    }}
                                />

                                <DetailRow
                                    label="Gross Salary"
                                    value={
                                        money(
                                            payroll.gross_salary
                                        )
                                    }
                                    strong
                                />

                                <DetailRow
                                    label="Daily Salary"
                                    value={
                                        money(
                                            payroll.daily_salary
                                        )
                                    }
                                />

                                <DetailRow
                                    label="Earned Salary"
                                    value={
                                        money(
                                            payroll.earned_salary
                                        )
                                    }
                                />

                            </SectionCard>

                        </Grid>


                        {/* DEDUCTIONS */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <SectionCard
                                title="Deductions"
                            >

                                <DetailRow
                                    label="PF"
                                    value={
                                        money(
                                            payroll.pf
                                        )
                                    }
                                />

                                <DetailRow
                                    label="Professional Tax"
                                    value={
                                        money(
                                            payroll.professional_tax
                                        )
                                    }
                                />

                                {/* IMPORTANT:
                                    This is the amount recovered
                                    from the employee's salary
                                    advance during this payroll month.
                                */}

                                <DetailRow
                                    label="Advance Recovery"
                                    value={
                                        money(
                                            payroll.advance_taken
                                        )
                                    }
                                />

                                <DetailRow
                                    label="Salary Advance Deduction"
                                    value={
                                        money(
                                            payroll.advance_deduction
                                        )
                                    }
                                />

                                <Divider
                                    sx={{
                                        my: 1.2,
                                        borderColor:
                                            COLORS.border,
                                    }}
                                />

                                <DetailRow
                                    label="Total Deductions"
                                    value={
                                        money(
                                            payroll.total_deductions
                                        )
                                    }
                                    strong
                                />

                            </SectionCard>

                        </Grid>


                        {/* ==================================================
                            ADVANCE DETAILS
                        ================================================== */}

                        <Grid
                            item
                            xs={12}
                        >

                            <Card
                                sx={{
                                    borderRadius: 3,
                                    border:
                                        `1px solid ${COLORS.border}`,
                                    boxShadow:
                                        "0 4px 14px rgba(60,40,20,0.05)",
                                }}
                            >

                                <CardContent
                                    sx={{
                                        p: {
                                            xs: 2.5,
                                            md: 3,
                                        },
                                    }}
                                >

                                    <Grid
                                        container
                                        spacing={3}
                                        alignItems="center"
                                    >

                                        {/* ADVANCE INFORMATION */}

                                        <Grid
                                            item
                                            xs={12}
                                            md={7}
                                        >

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    gap: 1,
                                                    mb: 2,
                                                }}
                                            >

                                                <AccountBalanceWalletIcon
                                                    sx={{
                                                        color:
                                                            COLORS.goldDark,
                                                    }}
                                                />

                                                <Typography
                                                    sx={{
                                                        fontSize: 20,
                                                        fontWeight: 700,
                                                        color:
                                                            COLORS.brown,
                                                    }}
                                                >
                                                    Salary Advance Details
                                                </Typography>

                                            </Box>


                                            <Grid
                                                container
                                                spacing={2}
                                            >

                                                {/* MAIN ADVANCE */}

                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={4}
                                                >

                                                    <InfoBox
                                                        label="Main Advance"
                                                        value={
                                                            money(
                                                                payroll.main_advance_amount
                                                            )
                                                        }
                                                    />

                                                </Grid>


                                                {/* RECOVERED */}

                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={4}
                                                >

                                                    <InfoBox
                                                        label="Recovered This Month"
                                                        value={
                                                            money(
                                                                payroll.advance_deduction
                                                            )
                                                        }
                                                    />

                                                </Grid>


                                                {/* REMAINING */}

                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={4}
                                                >

                                                    <InfoBox
                                                        label="Remaining Advance"
                                                        value={
                                                            money(
                                                                payroll.advance_remaining
                                                            )
                                                        }
                                                    />

                                                </Grid>

                                            </Grid>

                                        </Grid>


                                        {/* FINAL SALARY + BUTTONS */}

                                        <Grid
                                            item
                                            xs={12}
                                            md={5}
                                        >

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2.5,
                                                    background:
                                                        COLORS.soft,
                                                    border:
                                                        `1px solid ${COLORS.border}`,
                                                    mb: 2,
                                                }}
                                            >

                                                <Typography
                                                    fontSize={13}
                                                    color={
                                                        COLORS.muted
                                                    }
                                                >
                                                    Final Net Salary
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize: 31,
                                                        fontWeight: 800,
                                                        color:
                                                            COLORS.goldDark,
                                                    }}
                                                >
                                                    {
                                                        money(
                                                            payroll.net_salary
                                                        )
                                                    }
                                                </Typography>

                                            </Box>


                                            <Grid
                                                container
                                                spacing={1.5}
                                            >

                                                {/* SAVE */}

                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                >

                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        startIcon={
                                                            <SaveIcon />
                                                        }
                                                        onClick={
                                                            handleSavePayroll
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        sx={{
                                                            minHeight: 48,
                                                            borderRadius: 2,
                                                            background:
                                                                "linear-gradient(135deg,#dda625,#c89425)",
                                                            color:
                                                                COLORS.brown,
                                                            fontWeight: 800,
                                                            textTransform:
                                                                "none",
                                                        }}
                                                    >
                                                        {
                                                            loading
                                                                ? "Saving..."
                                                                : "Save Payroll"
                                                        }
                                                    </Button>

                                                </Grid>


                                                {/* DOWNLOAD */}

                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={6}
                                                >

                                                    <Button
                                                        fullWidth
                                                        variant="contained"
                                                        startIcon={
                                                            <DownloadIcon />
                                                        }
                                                        onClick={
                                                            handleDownloadPayslip
                                                        }
                                                        disabled={
                                                            downloading
                                                        }
                                                        sx={{
                                                            minHeight: 48,
                                                            borderRadius: 2,
                                                            background:
                                                                COLORS.green,
                                                            color:
                                                                "#fff",
                                                            fontWeight: 800,
                                                            textTransform:
                                                                "none",
                                                            "&:hover": {
                                                                background:
                                                                    "#256b29",
                                                            },
                                                        }}
                                                    >
                                                        {
                                                            downloading
                                                                ? "Downloading..."
                                                                : "Download Payslip"
                                                        }
                                                    </Button>

                                                </Grid>

                                            </Grid>

                                        </Grid>

                                    </Grid>

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