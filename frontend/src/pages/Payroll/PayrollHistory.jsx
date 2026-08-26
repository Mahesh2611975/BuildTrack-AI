import { useEffect, useMemo, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import PaymentsIcon from "@mui/icons-material/Payments";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HistoryIcon from "@mui/icons-material/History";

import api from "../../services/api";


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
    white: "#fffdfa",
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

const monthName = (month) => {
    if (!month) return "-";

    return new Date(
        2000,
        Number(month) - 1,
        1
    ).toLocaleString("en-IN", {
        month: "long",
    });
};


// ============================================================
// STATUS CHIP
// ============================================================

function StatusChip({ status }) {
    const normalized = String(status || "").toUpperCase();

    let label = normalized || "UNKNOWN";
    let color = "default";
    let icon = null;

    if (normalized === "FINALIZED") {
        color = "success";
        icon = <CheckCircleIcon sx={{ fontSize: 16 }} />;
    } else if (normalized === "PAID") {
        color = "success";
        icon = <PaymentsIcon sx={{ fontSize: 16 }} />;
    } else if (normalized === "PENDING") {
        color = "warning";
    } else {
        color = "default";
    }

    return (
        <Chip
            size="small"
            icon={icon}
            label={label}
            color={color}
            sx={{
                fontWeight: 700,
                borderRadius: 2,
            }}
        />
    );
}


// ============================================================
// STAT CARD
// ============================================================

function StatCard({ title, value, subtitle, icon }) {
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 3,
                border: `1px solid ${COLORS.border}`,
                boxShadow: "0 5px 18px rgba(60,40,20,0.06)",
            }}
        >
            <CardContent sx={{ p: 2.5 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            sx={{
                                color: COLORS.muted,
                                fontSize: 13,
                                fontWeight: 600,
                            }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.7,
                                fontSize: 25,
                                fontWeight: 800,
                                color: COLORS.brown,
                            }}
                        >
                            {value}
                        </Typography>

                        {subtitle && (
                            <Typography
                                sx={{
                                    mt: 0.4,
                                    color: COLORS.muted,
                                    fontSize: 12,
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: COLORS.soft,
                            color: COLORS.goldDark,
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}


// ============================================================
// PAYROLL HISTORY PAGE
// ============================================================

function PayrollHistory() {

    const [history, setHistory] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [yearFilter, setYearFilter] = useState("all");

    const [monthFilter, setMonthFilter] = useState("all");

    const [selectedPayroll, setSelectedPayroll] = useState(null);

    const [downloadingId, setDownloadingId] = useState(null);


    // ========================================================
    // LOAD PAYROLL HISTORY
    // ========================================================

    const loadHistory = async () => {

        try {

            setLoading(true);

            const response =
                await api.get("/payroll-history");

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            setHistory(data);

        } catch (error) {

            console.error(
                "Failed to load payroll history:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to load payroll history"
            );

        } finally {

            setLoading(false);

        }
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadHistory();

    }, []);


    // ========================================================
    // AVAILABLE YEARS
    // ========================================================

    const years = useMemo(() => {

        const uniqueYears = [
            ...new Set(
                history
                    .map((item) => item.year)
                    .filter(Boolean)
            ),
        ];

        return uniqueYears.sort(
            (a, b) => Number(b) - Number(a)
        );

    }, [history]);


    // ========================================================
    // FILTER HISTORY
    // ========================================================

    const filteredHistory = useMemo(() => {

        const query =
            search.trim().toLowerCase();

        return history.filter((item) => {

            const employeeName =
                String(
                    item.employee_name || ""
                ).toLowerCase();

            const employeeCode =
                String(
                    item.employee_code || ""
                ).toLowerCase();

            const yearMatch =
                yearFilter === "all" ||
                Number(item.year) === Number(yearFilter);

            const monthMatch =
                monthFilter === "all" ||
                Number(item.month) === Number(monthFilter);

            const searchMatch =
                !query ||
                employeeName.includes(query) ||
                employeeCode.includes(query);

            return (
                yearMatch &&
                monthMatch &&
                searchMatch
            );

        });

    }, [
        history,
        search,
        yearFilter,
        monthFilter,
    ]);


    // ========================================================
    // SUMMARY
    // ========================================================

    const summary = useMemo(() => {

        const totalGross =
            filteredHistory.reduce(
                (sum, item) =>
                    sum +
                    Number(item.gross_salary || 0),
                0
            );

        const totalNet =
            filteredHistory.reduce(
                (sum, item) =>
                    sum +
                    Number(item.net_salary || 0),
                0
            );

        const totalDeductions =
            filteredHistory.reduce(
                (sum, item) =>
                    sum +
                    Number(item.total_deductions || 0),
                0
            );

        const finalized =
            filteredHistory.filter(
                (item) =>
                    String(item.status || "")
                        .toUpperCase() ===
                    "FINALIZED"
            ).length;

        return {
            totalRecords: filteredHistory.length,
            totalGross,
            totalNet,
            totalDeductions,
            finalized,
        };

    }, [filteredHistory]);


    // ========================================================
    // DOWNLOAD PAYSLIP
    // ========================================================

    const handleDownloadPayslip = async (payroll) => {

        try {

            setDownloadingId(payroll.id);

            /*
             * Backend payslip endpoint:
             *
             * /payroll/{employee_id}/{year}/{month}/payslip
             *
             * If your existing payrollService already exposes
             * this endpoint, you can move this logic there.
             */

            const response = await api.get(
                `/payroll/${payroll.employee_id}/${payroll.year}/${payroll.month}/payslip`,
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
                `payslip_${payroll.employee_id}_${payroll.year}_${payroll.month}.pdf`;

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
                error.response?.data?.detail ||
                "Failed to download payslip"
            );

        } finally {

            setDownloadingId(null);

        }
    };


    // ========================================================
    // CLEAR FILTERS
    // ========================================================

    const handleClearFilters = () => {

        setSearch("");
        setYearFilter("all");
        setMonthFilter("all");

    };


    // ========================================================
    // UI
    // ========================================================

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
                        Payroll History
                    </Typography>

                    <Typography
                        sx={{
                            color: COLORS.muted,
                            mt: 0.8,
                        }}
                    >
                        View finalized employee payroll records
                    </Typography>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={
                        <RefreshIcon />
                    }
                    onClick={loadHistory}
                    disabled={loading}
                    sx={{
                        minHeight: 46,
                        px: 2.5,
                        borderRadius: 2.5,
                        borderColor:
                            COLORS.goldDark,
                        color: COLORS.brown,
                        fontWeight: 700,
                        textTransform: "none",
                    }}
                >
                    Refresh
                </Button>

            </Box>


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <Grid
                container
                spacing={2}
                sx={{ mb: 3 }}
            >

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StatCard
                        title="Payroll Records"
                        value={
                            summary.totalRecords
                        }
                        subtitle="Filtered records"
                        icon={
                            <HistoryIcon />
                        }
                    />
                </Grid>


                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StatCard
                        title="Gross Payroll"
                        value={money(
                            summary.totalGross
                        )}
                        subtitle="Total gross salary"
                        icon={
                            <AccountBalanceWalletIcon />
                        }
                    />
                </Grid>


                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StatCard
                        title="Total Deductions"
                        value={money(
                            summary.totalDeductions
                        )}
                        subtitle="PF, tax & advances"
                        icon={
                            <PaymentsIcon />
                        }
                    />
                </Grid>


                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >
                    <StatCard
                        title="Net Payroll"
                        value={money(
                            summary.totalNet
                        )}
                        subtitle={
                            `${summary.finalized} finalized`
                        }
                        icon={
                            <CheckCircleIcon />
                        }
                    />
                </Grid>

            </Grid>


            {/* ==================================================
                FILTER CARD
            ================================================== */}

            <Card
                sx={{
                    mb: 3,
                    borderRadius: 3,
                    border:
                        `1px solid ${COLORS.border}`,
                    boxShadow:
                        "0 5px 18px rgba(60,40,20,0.06)",
                }}
            >

                <CardContent>

                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                    >

                        {/* SEARCH */}

                        <Grid
                            item
                            xs={12}
                            md={5}
                        >

                            <TextField
                                fullWidth
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                placeholder="Search employee or employee code..."
                                sx={{
                                    "& .MuiOutlinedInput-root":
                                        {
                                            borderRadius: 2,
                                            background:
                                                COLORS.white,
                                        },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon
                                                sx={{
                                                    color:
                                                        COLORS.muted,
                                                }}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                        </Grid>


                        {/* YEAR */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                        >

                            <Select
                                fullWidth
                                value={yearFilter}
                                onChange={(e) =>
                                    setYearFilter(
                                        e.target.value
                                    )
                                }
                                displayEmpty
                                sx={{
                                    borderRadius: 2,
                                    background:
                                        COLORS.white,
                                }}
                            >

                                <MenuItem value="all">
                                    All Years
                                </MenuItem>

                                {years.map(
                                    (year) => (
                                        <MenuItem
                                            key={year}
                                            value={year}
                                        >
                                            {year}
                                        </MenuItem>
                                    )
                                )}

                            </Select>

                        </Grid>


                        {/* MONTH */}

                        <Grid
                            item
                            xs={12}
                            sm={6}
                            md={2}
                        >

                            <Select
                                fullWidth
                                value={monthFilter}
                                onChange={(e) =>
                                    setMonthFilter(
                                        e.target.value
                                    )
                                }
                                displayEmpty
                                sx={{
                                    borderRadius: 2,
                                    background:
                                        COLORS.white,
                                }}
                            >

                                <MenuItem value="all">
                                    All Months
                                </MenuItem>

                                {Array.from(
                                    { length: 12 },
                                    (_, index) => {

                                        const month =
                                            index + 1;

                                        return (
                                            <MenuItem
                                                key={month}
                                                value={month}
                                            >
                                                {monthName(
                                                    month
                                                )}
                                            </MenuItem>
                                        );
                                    }
                                )}

                            </Select>

                        </Grid>


                        {/* CLEAR */}

                        <Grid
                            item
                            xs={12}
                            md={3}
                        >

                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={
                                    handleClearFilters
                                }
                                sx={{
                                    height: 48,
                                    borderRadius: 2,
                                    borderColor:
                                        COLORS.border,
                                    color:
                                        COLORS.brown,
                                    fontWeight: 700,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Clear Filters
                            </Button>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ==================================================
                PAYROLL TABLE
            ================================================== */}

            <Card
                sx={{
                    borderRadius: 3,
                    border:
                        `1px solid ${COLORS.border}`,
                    boxShadow:
                        "0 5px 18px rgba(60,40,20,0.06)",
                    overflow: "hidden",
                }}
            >

                {/* TABLE HEADER */}

                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        borderBottom:
                            `1px solid ${COLORS.border}`,
                    }}
                >

                    <CalendarMonthIcon
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
                        Payroll Records
                    </Typography>

                </Box>


                {/* LOADING */}

                {loading && (

                    <Box
                        sx={{
                            py: 8,
                            display: "flex",
                            justifyContent:
                                "center",
                        }}
                    >
                        <CircularProgress
                            sx={{
                                color:
                                    COLORS.goldDark,
                            }}
                        />
                    </Box>

                )}


                {/* EMPTY */}

                {!loading &&
                    filteredHistory.length === 0 && (

                        <Box
                            sx={{
                                py: 8,
                                px: 3,
                                textAlign: "center",
                            }}
                        >

                            <HistoryIcon
                                sx={{
                                    fontSize: 50,
                                    color:
                                        COLORS.goldDark,
                                    mb: 1,
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
                                No Payroll History
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.7,
                                    color:
                                        COLORS.muted,
                                }}
                            >
                                No payroll records match
                                your current filters.
                            </Typography>

                        </Box>

                    )}


                {/* DESKTOP TABLE */}

                {!loading &&
                    filteredHistory.length > 0 && (

                        <Box
                            sx={{
                                width: "100%",
                                overflowX: "auto",
                            }}
                        >

                            <Box
                                sx={{
                                    minWidth: 1100,
                                }}
                            >

                                {/* HEADER */}

                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "1.5fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr 1.3fr",
                                        px: 3,
                                        py: 2,
                                        background:
                                            "#fffaf0",
                                        borderBottom:
                                            `1px solid ${COLORS.border}`,
                                    }}
                                >

                                    {[
                                        "Employee",
                                        "Period",
                                        "Gross Salary",
                                        "Deductions",
                                        "Advance",
                                        "Net Salary",
                                        "Status",
                                        "Actions",
                                    ].map(
                                        (title) => (
                                            <Typography
                                                key={
                                                    title
                                                }
                                                sx={{
                                                    fontSize: 13,
                                                    fontWeight: 800,
                                                    color:
                                                        COLORS.brown,
                                                }}
                                            >
                                                {title}
                                            </Typography>
                                        )
                                    )}

                                </Box>


                                {/* ROWS */}

                                {filteredHistory.map(
                                    (payroll, index) => (

                                        <Box
                                            key={
                                                payroll.id ||
                                                index
                                            }
                                            sx={{
                                                display:
                                                    "grid",
                                                gridTemplateColumns:
                                                    "1.5fr 1fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr 1.3fr",
                                                px: 3,
                                                py: 2,
                                                alignItems:
                                                    "center",
                                                borderBottom:
                                                    index !==
                                                    filteredHistory.length -
                                                        1
                                                        ? `1px solid ${COLORS.border}`
                                                        : "none",
                                                "&:hover":
                                                    {
                                                        background:
                                                            "#fffaf5",
                                                    },
                                            }}
                                        >

                                            {/* EMPLOYEE */}

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            700,
                                                        color:
                                                            COLORS.brown,
                                                    }}
                                                >
                                                    {
                                                        payroll.employee_name ||
                                                        "-"
                                                    }
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            12,
                                                        color:
                                                            COLORS.muted,
                                                        mt: 0.3,
                                                    }}
                                                >
                                                    {
                                                        payroll.employee_code ||
                                                        `EMP-${payroll.employee_id}`
                                                    }
                                                </Typography>

                                            </Box>


                                            {/* PERIOD */}

                                            <Box>

                                                <Typography
                                                    sx={{
                                                        fontWeight:
                                                            600,
                                                        color:
                                                            COLORS.brown,
                                                    }}
                                                >
                                                    {
                                                        monthName(
                                                            payroll.month
                                                        )
                                                    }
                                                </Typography>

                                                <Typography
                                                    sx={{
                                                        fontSize:
                                                            12,
                                                        color:
                                                            COLORS.muted,
                                                    }}
                                                >
                                                    {
                                                        payroll.year
                                                    }
                                                </Typography>

                                            </Box>


                                            {/* GROSS */}

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        700,
                                                    color:
                                                        COLORS.brown,
                                                }}
                                            >
                                                {money(
                                                    payroll.gross_salary
                                                )}
                                            </Typography>


                                            {/* DEDUCTIONS */}

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                    color:
                                                        COLORS.red,
                                                }}
                                            >
                                                {money(
                                                    payroll.total_deductions
                                                )}
                                            </Typography>


                                            {/* ADVANCE */}

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        600,
                                                    color:
                                                        COLORS.brown,
                                                }}
                                            >
                                                {money(
                                                    payroll.advance_deduction ??
                                                    payroll.advance_taken
                                                )}
                                            </Typography>


                                            {/* NET */}

                                            <Typography
                                                sx={{
                                                    fontWeight:
                                                        800,
                                                    color:
                                                        COLORS.goldDark,
                                                }}
                                            >
                                                {money(
                                                    payroll.net_salary
                                                )}
                                            </Typography>


                                            {/* STATUS */}

                                            <StatusChip
                                                status={
                                                    payroll.status
                                                }
                                            />


                                            {/* ACTIONS */}

                                            <Box
                                                sx={{
                                                    display:
                                                        "flex",
                                                    gap: 0.5,
                                                }}
                                            >

                                                <IconButton
                                                    title="View payroll"
                                                    onClick={() =>
                                                        setSelectedPayroll(
                                                            payroll
                                                        )
                                                    }
                                                    sx={{
                                                        color:
                                                            COLORS.brown,
                                                    }}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>


                                                <IconButton
                                                    title="Download payslip"
                                                    onClick={() =>
                                                        handleDownloadPayslip(
                                                            payroll
                                                        )
                                                    }
                                                    disabled={
                                                        downloadingId ===
                                                        payroll.id
                                                    }
                                                    sx={{
                                                        color:
                                                            COLORS.green,
                                                    }}
                                                >
                                                    {downloadingId ===
                                                    payroll.id ? (
                                                        <CircularProgress
                                                            size={
                                                                20
                                                            }
                                                        />
                                                    ) : (
                                                        <DownloadIcon />
                                                    )}
                                                </IconButton>

                                            </Box>

                                        </Box>

                                    )
                                )}

                            </Box>

                        </Box>

                    )}

            </Card>


            {/* ==================================================
                PAYROLL DETAILS
            ================================================== */}

            {selectedPayroll && (

                <Card
                    sx={{
                        mt: 3,
                        borderRadius: 3,
                        border:
                            `1px solid ${COLORS.border}`,
                        boxShadow:
                            "0 5px 18px rgba(60,40,20,0.06)",
                    }}
                >

                    <CardContent sx={{ p: 3 }}>

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
                                        fontSize: 24,
                                        fontWeight: 800,
                                        color:
                                            COLORS.brown,
                                    }}
                                >
                                    Payroll Details
                                </Typography>

                                <Typography
                                    sx={{
                                        color:
                                            COLORS.muted,
                                        mt: 0.5,
                                    }}
                                >
                                    {
                                        selectedPayroll.employee_name
                                    }{" "}
                                    •{" "}
                                    {
                                        selectedPayroll.employee_code
                                    }{" "}
                                    •{" "}
                                    {
                                        monthName(
                                            selectedPayroll.month
                                        )
                                    }{" "}
                                    {
                                        selectedPayroll.year
                                    }
                                </Typography>

                            </Box>


                            <Button
                                variant="outlined"
                                onClick={() =>
                                    setSelectedPayroll(
                                        null
                                    )
                                }
                                sx={{
                                    borderRadius: 2,
                                    borderColor:
                                        COLORS.border,
                                    color:
                                        COLORS.brown,
                                    fontWeight: 700,
                                    textTransform:
                                        "none",
                                }}
                            >
                                Close
                            </Button>

                        </Box>


                        <Divider
                            sx={{
                                my: 2.5,
                                borderColor:
                                    COLORS.border,
                            }}
                        />


                        <Grid
                            container
                            spacing={2}
                        >

                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background:
                                            "#fffaf0",
                                        border:
                                            `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    <Typography
                                        fontSize={12}
                                        color={
                                            COLORS.muted
                                        }
                                    >
                                        Basic Salary
                                    </Typography>

                                    <Typography
                                        fontWeight={800}
                                        mt={0.5}
                                    >
                                        {money(
                                            selectedPayroll.basic_salary
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>


                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background:
                                            "#fffaf0",
                                        border:
                                            `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    <Typography
                                        fontSize={12}
                                        color={
                                            COLORS.muted
                                        }
                                    >
                                        HRA
                                    </Typography>

                                    <Typography
                                        fontWeight={800}
                                        mt={0.5}
                                    >
                                        {money(
                                            selectedPayroll.hra
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>


                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background:
                                            "#fffaf0",
                                        border:
                                            `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    <Typography
                                        fontSize={12}
                                        color={
                                            COLORS.muted
                                        }
                                    >
                                        Advance Recovery
                                    </Typography>

                                    <Typography
                                        fontWeight={800}
                                        mt={0.5}
                                        color={
                                            COLORS.red
                                        }
                                    >
                                        {money(
                                            selectedPayroll.advance_deduction ??
                                            selectedPayroll.advance_taken
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>


                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                            >
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        background:
                                            COLORS.soft,
                                        border:
                                            `1px solid ${COLORS.border}`,
                                    }}
                                >
                                    <Typography
                                        fontSize={12}
                                        color={
                                            COLORS.muted
                                        }
                                    >
                                        Net Salary
                                    </Typography>

                                    <Typography
                                        fontSize={22}
                                        fontWeight={900}
                                        mt={0.5}
                                        color={
                                            COLORS.goldDark
                                        }
                                    >
                                        {money(
                                            selectedPayroll.net_salary
                                        )}
                                    </Typography>
                                </Box>
                            </Grid>

                        </Grid>


                        <Grid
                            container
                            spacing={3}
                            sx={{ mt: 0.5 }}
                        >

                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <Typography
                                    fontWeight={800}
                                    color={
                                        COLORS.brown
                                    }
                                    mb={1}
                                >
                                    Attendance
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Working Days:{" "}
                                    <strong>
                                        {
                                            selectedPayroll.total_working_days
                                        }
                                    </strong>
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Present Days:{" "}
                                    <strong>
                                        {
                                            selectedPayroll.present_days
                                        }
                                    </strong>
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Paid Days:{" "}
                                    <strong>
                                        {
                                            selectedPayroll.paid_days
                                        }
                                    </strong>
                                </Typography>

                            </Grid>


                            <Grid
                                item
                                xs={12}
                                md={6}
                            >

                                <Typography
                                    fontWeight={800}
                                    color={
                                        COLORS.brown
                                    }
                                    mb={1}
                                >
                                    Deductions
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    PF:{" "}
                                    <strong>
                                        {money(
                                            selectedPayroll.pf
                                        )}
                                    </strong>
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Professional Tax:{" "}
                                    <strong>
                                        {money(
                                            selectedPayroll.professional_tax
                                        )}
                                    </strong>
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Advance Deduction:{" "}
                                    <strong>
                                        {money(
                                            selectedPayroll.advance_deduction
                                        )}
                                    </strong>
                                </Typography>

                                <Typography
                                    color={
                                        COLORS.muted
                                    }
                                >
                                    Total Deductions:{" "}
                                    <strong>
                                        {money(
                                            selectedPayroll.total_deductions
                                        )}
                                    </strong>
                                </Typography>

                            </Grid>

                        </Grid>

                    </CardContent>

                </Card>

            )}

        </Box>
    );
}


export default PayrollHistory;