import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
    downloadEmployeeReport,
    downloadProjectReport,
    downloadAttendanceReport,
    getManagementSummary,
} from "../../services/reportService";


const GOLD = "#dca62f";
const GOLD_DARK = "#bd8a20";
const BROWN = "#3b2823";
const TEXT = "#2d211d";
const MUTED = "#8a7568";
const CREAM = "#fffaf0";
const BORDER = "#eadfca";


function ReportsPage() {

    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    // PDF dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [reportType, setReportType] = useState("");

    const [employeeId, setEmployeeId] = useState("");
    const [projectId, setProjectId] = useState("");
    const [year, setYear] = useState(
        new Date().getFullYear()
    );
    const [month, setMonth] = useState(
        new Date().getMonth() + 1
    );

    const [generating, setGenerating] = useState(false);


    // =====================================================
    // LOAD SUMMARY
    // =====================================================

    const fetchSummary = async () => {

        try {

            setLoading(true);

            const response =
                await getManagementSummary();

            setSummary(
                response.data?.data || null
            );

        } catch (error) {

            console.error(
                "Failed to load report summary:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        fetchSummary();
    }, []);


    // =====================================================
    // DOWNLOAD PDF
    // =====================================================

    const downloadPdf = (
        response,
        filename
    ) => {

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
        link.download = filename;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        window.URL.revokeObjectURL(url);
    };


    // =====================================================
    // OPEN REPORT DIALOG
    // =====================================================

    const openReportDialog = (type) => {

        setReportType(type);

        setEmployeeId("");
        setProjectId("");

        setYear(
            new Date().getFullYear()
        );

        setMonth(
            new Date().getMonth() + 1
        );

        setDialogOpen(true);
    };


    // =====================================================
    // CLOSE DIALOG
    // =====================================================

    const closeDialog = () => {

        if (generating) {
            return;
        }

        setDialogOpen(false);
    };


    // =====================================================
    // GENERATE REPORT
    // =====================================================

    const handleGenerateReport = async () => {

        try {

            setGenerating(true);

            let response;
            let filename;

            // ---------------------------------------------
            // EMPLOYEE
            // ---------------------------------------------

            if (reportType === "employee") {

                if (!employeeId) {
                    return;
                }

                response =
                    await downloadEmployeeReport(
                        employeeId
                    );

                filename =
                    `Employee_${employeeId}.pdf`;
            }


            // ---------------------------------------------
            // PROJECT
            // ---------------------------------------------

            if (reportType === "project") {

                if (!projectId) {
                    return;
                }

                response =
                    await downloadProjectReport(
                        projectId
                    );

                filename =
                    `Project_${projectId}.pdf`;
            }


            // ---------------------------------------------
            // ATTENDANCE
            // ---------------------------------------------

            if (reportType === "attendance") {

                if (!employeeId) {
                    return;
                }

                response =
                    await downloadAttendanceReport(
                        employeeId,
                        year,
                        month
                    );

                filename =
                    `Attendance_${employeeId}_${year}_${month}.pdf`;
            }


            downloadPdf(
                response,
                filename
            );

            setDialogOpen(false);

        } catch (error) {

            console.error(
                "Failed to generate report:",
                error
            );

        } finally {

            setGenerating(false);
        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    minHeight: "70vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress
                    sx={{
                        color: GOLD,
                    }}
                />
            </Box>

        );
    }


    return (

        <Box
            sx={{
                minHeight: "calc(100vh - 74px)",
                background:
                    "linear-gradient(135deg, #fffaf0 0%, #f8efd9 100%)",
                p: {
                    xs: 2,
                    md: 3.5,
                },
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
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >

                <Box>

                    <Typography
                        sx={{
                            fontFamily:
                                '"Playfair Display", Georgia, serif',
                            fontSize: {
                                xs: "30px",
                                md: "36px",
                            },
                            fontWeight: 700,
                            color: BROWN,
                            lineHeight: 1.2,
                        }}
                    >
                        Reports
                    </Typography>

                    <Typography
                        sx={{
                            color: MUTED,
                            fontSize: "14px",
                            mt: 0.5,
                        }}
                    >
                        Generate printable management reports
                    </Typography>

                </Box>


                <Button
                    startIcon={<RefreshIcon />}
                    onClick={fetchSummary}
                    sx={{
                        minWidth: 48,
                        width: 48,
                        height: 44,
                        borderRadius: "12px",
                        color: BROWN,
                        backgroundColor: "#fffdf8",
                        border:
                            `1px solid ${BORDER}`,
                        boxShadow:
                            "0 3px 10px rgba(59,40,35,0.06)",
                        "&:hover": {
                            backgroundColor: "#f7ecd5",
                        },
                        "& .MuiButton-startIcon": {
                            margin: 0,
                        },
                    }}
                />
            </Box>


            {/* ================================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================================= */}

            <Grid
                container
                spacing={2}
                sx={{
                    mb: 3,
                }}
            >

                {/* Employees */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card
                        sx={{
                            borderRadius: "16px",
                            border:
                                `1px solid ${BORDER}`,
                            backgroundColor: "#fffdf8",
                            boxShadow:
                                "0 5px 16px rgba(59,40,35,0.07)",
                            height: "100%",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 2.5,
                                "&:last-child": {
                                    pb: 2.5,
                                },
                            }}
                        >

                            <PeopleIcon
                                sx={{
                                    color: GOLD_DARK,
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: MUTED,
                                    fontSize: "13px",
                                }}
                            >
                                Total Employees
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", Georgia, serif',
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: TEXT,
                                }}
                            >
                                {
                                    summary
                                        ?.employees
                                        ?.total ?? 0
                                }
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Active Employees */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card
                        sx={{
                            borderRadius: "16px",
                            border:
                                `1px solid ${BORDER}`,
                            backgroundColor: "#fffdf8",
                            boxShadow:
                                "0 5px 16px rgba(59,40,35,0.07)",
                            height: "100%",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 2.5,
                                "&:last-child": {
                                    pb: 2.5,
                                },
                            }}
                        >

                            <EngineeringIcon
                                sx={{
                                    color: GOLD_DARK,
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: MUTED,
                                    fontSize: "13px",
                                }}
                            >
                                Active Employees
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", Georgia, serif',
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: TEXT,
                                }}
                            >
                                {
                                    summary
                                        ?.employees
                                        ?.active ?? 0
                                }
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Projects */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card
                        sx={{
                            borderRadius: "16px",
                            border:
                                `1px solid ${BORDER}`,
                            backgroundColor: "#fffdf8",
                            boxShadow:
                                "0 5px 16px rgba(59,40,35,0.07)",
                            height: "100%",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 2.5,
                                "&:last-child": {
                                    pb: 2.5,
                                },
                            }}
                        >

                            <AssessmentIcon
                                sx={{
                                    color: GOLD_DARK,
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: MUTED,
                                    fontSize: "13px",
                                }}
                            >
                                Total Projects
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", Georgia, serif',
                                    fontSize: "30px",
                                    fontWeight: 700,
                                    color: TEXT,
                                }}
                            >
                                {
                                    summary
                                        ?.projects
                                        ?.total ?? 0
                                }
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Budget */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card
                        sx={{
                            borderRadius: "16px",
                            border:
                                `1px solid ${BORDER}`,
                            backgroundColor: "#fffdf8",
                            boxShadow:
                                "0 5px 16px rgba(59,40,35,0.07)",
                            height: "100%",
                        }}
                    >

                        <CardContent
                            sx={{
                                p: 2.5,
                                "&:last-child": {
                                    pb: 2.5,
                                },
                            }}
                        >

                            <AccountBalanceIcon
                                sx={{
                                    color: GOLD_DARK,
                                    fontSize: 30,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                sx={{
                                    color: MUTED,
                                    fontSize: "13px",
                                }}
                            >
                                Project Budget
                            </Typography>

                            <Typography
                                sx={{
                                    fontFamily:
                                        '"Playfair Display", Georgia, serif',
                                    fontSize: {
                                        xs: "25px",
                                        md: "27px",
                                    },
                                    fontWeight: 700,
                                    color: TEXT,
                                }}
                            >
                                ₹
                                {
                                    Number(
                                        summary
                                            ?.projects
                                            ?.total_budget ?? 0
                                    ).toLocaleString(
                                        "en-IN"
                                    )
                                }
                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>


            {/* ================================================= */}
            {/* GENERATE REPORT */}
            {/* ================================================= */}

            <Card
                sx={{
                    borderRadius: "18px",
                    border:
                        `1px solid ${BORDER}`,
                    backgroundColor: "#fffdf8",
                    boxShadow:
                        "0 6px 20px rgba(59,40,35,0.07)",
                    mb: 3,
                }}
            >

                <CardContent
                    sx={{
                        p: {
                            xs: 2.5,
                            md: 3,
                        },
                        "&:last-child": {
                            pb: 3,
                        },
                    }}
                >

                    <Typography
                        sx={{
                            fontFamily:
                                '"Playfair Display", Georgia, serif',
                            fontSize: "22px",
                            fontWeight: 700,
                            color: BROWN,
                            mb: 2.5,
                        }}
                    >
                        Generate Report
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                    >

                        {/* Employee */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Button
                                fullWidth
                                startIcon={
                                    <PictureAsPdfIcon />
                                }
                                onClick={() =>
                                    openReportDialog(
                                        "employee"
                                    )
                                }
                                sx={{
                                    height: 52,
                                    borderRadius: "11px",
                                    background:
                                        `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                                    color: BROWN,
                                    fontWeight: 800,
                                    textTransform: "none",
                                    boxShadow:
                                        "0 5px 12px rgba(189,138,32,0.22)",
                                    "&:hover": {
                                        background:
                                            `linear-gradient(135deg, ${GOLD_DARK}, #a97616)`,
                                    },
                                }}
                            >
                                Employee PDF Report
                            </Button>

                        </Grid>


                        {/* Project */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Button
                                fullWidth
                                startIcon={
                                    <PictureAsPdfIcon />
                                }
                                onClick={() =>
                                    openReportDialog(
                                        "project"
                                    )
                                }
                                sx={{
                                    height: 52,
                                    borderRadius: "11px",
                                    background:
                                        `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                                    color: BROWN,
                                    fontWeight: 800,
                                    textTransform: "none",
                                    boxShadow:
                                        "0 5px 12px rgba(189,138,32,0.22)",
                                    "&:hover": {
                                        background:
                                            `linear-gradient(135deg, ${GOLD_DARK}, #a97616)`,
                                    },
                                }}
                            >
                                Project PDF Report
                            </Button>

                        </Grid>


                        {/* Attendance */}

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Button
                                fullWidth
                                startIcon={
                                    <PictureAsPdfIcon />
                                }
                                onClick={() =>
                                    openReportDialog(
                                        "attendance"
                                    )
                                }
                                sx={{
                                    height: 52,
                                    borderRadius: "11px",
                                    background:
                                        `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                                    color: BROWN,
                                    fontWeight: 800,
                                    textTransform: "none",
                                    boxShadow:
                                        "0 5px 12px rgba(189,138,32,0.22)",
                                    "&:hover": {
                                        background:
                                            `linear-gradient(135deg, ${GOLD_DARK}, #a97616)`,
                                    },
                                }}
                            >
                                Attendance PDF Report
                            </Button>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* PROJECT STATUS */}
            {/* ================================================= */}

            <Card
                sx={{
                    borderRadius: "18px",
                    border:
                        `1px solid ${BORDER}`,
                    backgroundColor: "#fffdf8",
                    boxShadow:
                        "0 6px 20px rgba(59,40,35,0.07)",
                }}
            >

                <CardContent
                    sx={{
                        p: 3,
                        "&:last-child": {
                            pb: 3,
                        },
                    }}
                >

                    <Typography
                        sx={{
                            fontFamily:
                                '"Playfair Display", Georgia, serif',
                            fontSize: "22px",
                            fontWeight: 700,
                            color: BROWN,
                            mb: 2.5,
                        }}
                    >
                        Project Status
                    </Typography>


                    <Grid
                        container
                        spacing={2}
                    >

                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: "12px",
                                    backgroundColor:
                                        "#faf4e7",
                                    border:
                                        `1px solid ${BORDER}`,
                                }}
                            >

                                <Typography
                                    sx={{
                                        color: MUTED,
                                        fontSize: "13px",
                                    }}
                                >
                                    Planned
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Playfair Display", Georgia, serif',
                                        fontSize: "28px",
                                        fontWeight: 700,
                                        color: TEXT,
                                    }}
                                >
                                    {
                                        summary
                                            ?.projects
                                            ?.planned ?? 0
                                    }
                                </Typography>

                            </Box>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: "12px",
                                    backgroundColor:
                                        "#faf4e7",
                                    border:
                                        `1px solid ${BORDER}`,
                                }}
                            >

                                <Typography
                                    sx={{
                                        color: MUTED,
                                        fontSize: "13px",
                                    }}
                                >
                                    In Progress
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Playfair Display", Georgia, serif',
                                        fontSize: "28px",
                                        fontWeight: 700,
                                        color: TEXT,
                                    }}
                                >
                                    {
                                        summary
                                            ?.projects
                                            ?.in_progress ?? 0
                                    }
                                </Typography>

                            </Box>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: "12px",
                                    backgroundColor:
                                        "#faf4e7",
                                    border:
                                        `1px solid ${BORDER}`,
                                }}
                            >

                                <Typography
                                    sx={{
                                        color: MUTED,
                                        fontSize: "13px",
                                    }}
                                >
                                    Completed
                                </Typography>

                                <Typography
                                    sx={{
                                        fontFamily:
                                            '"Playfair Display", Georgia, serif',
                                        fontSize: "28px",
                                        fontWeight: 700,
                                        color: TEXT,
                                    }}
                                >
                                    {
                                        summary
                                            ?.projects
                                            ?.completed ?? 0
                                    }
                                </Typography>

                            </Box>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* REPORT DIALOG */}
            {/* ================================================= */}

            <Dialog
                open={dialogOpen}
                onClose={closeDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        backgroundColor: "#fffdf8",
                        border:
                            `1px solid ${BORDER}`,
                        boxShadow:
                            "0 20px 60px rgba(45,33,29,0.25)",
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        fontFamily:
                            '"Playfair Display", Georgia, serif',
                        fontSize: "25px",
                        fontWeight: 700,
                        color: BROWN,
                        pb: 1,
                    }}
                >
                    {reportType === "employee" &&
                        "Generate Employee Report"}

                    {reportType === "project" &&
                        "Generate Project Report"}

                    {reportType === "attendance" &&
                        "Generate Attendance Report"}
                </DialogTitle>


                <DialogContent
                    sx={{
                        pt: "12px !important",
                    }}
                >

                    {/* Employee */}

                    {(
                        reportType === "employee" ||
                        reportType === "attendance"
                    ) && (

                        <TextField
                            fullWidth
                            label="Employee Database ID"
                            value={employeeId}
                            onChange={(e) =>
                                setEmployeeId(
                                    e.target.value
                                )
                            }
                            placeholder="Enter employee ID"
                            sx={{
                                mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "11px",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: GOLD,
                                    },
                                "& .MuiInputLabel-root.Mui-focused":
                                    {
                                        color: GOLD_DARK,
                                    },
                            }}
                        />

                    )}


                    {/* Project */}

                    {reportType === "project" && (

                        <TextField
                            fullWidth
                            label="Project Database ID"
                            value={projectId}
                            onChange={(e) =>
                                setProjectId(
                                    e.target.value
                                )
                            }
                            placeholder="Enter project ID"
                            sx={{
                                mt: 1,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "11px",
                                },
                                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: GOLD,
                                    },
                                "& .MuiInputLabel-root.Mui-focused":
                                    {
                                        color: GOLD_DARK,
                                    },
                            }}
                        />

                    )}


                    {/* Attendance */}

                    {reportType === "attendance" && (

                        <Grid
                            container
                            spacing={2}
                            sx={{ mt: 0.5 }}
                        >

                            <Grid
                                item
                                xs={6}
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
                                        onChange={(e) =>
                                            setYear(
                                                e.target.value
                                            )
                                        }
                                        sx={{
                                            borderRadius: "11px",
                                        }}
                                    >

                                        {Array.from(
                                            {
                                                length: 6,
                                            },
                                            (_, index) =>
                                                new Date()
                                                    .getFullYear() -
                                                index
                                        ).map(
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


                            <Grid
                                item
                                xs={6}
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
                                        onChange={(e) =>
                                            setMonth(
                                                e.target.value
                                            )
                                        }
                                        sx={{
                                            borderRadius: "11px",
                                        }}
                                    >

                                        {Array.from(
                                            {
                                                length: 12,
                                            },
                                            (_, index) => (
                                                <MenuItem
                                                    key={index + 1}
                                                    value={index + 1}
                                                >
                                                    {index + 1}
                                                </MenuItem>
                                            )
                                        )}

                                    </Select>

                                </FormControl>

                            </Grid>

                        </Grid>

                    )}

                </DialogContent>


                <DialogActions
                    sx={{
                        p: 2.5,
                        pt: 1,
                        gap: 1,
                    }}
                >

                    <Button
                        onClick={closeDialog}
                        disabled={generating}
                        sx={{
                            color: MUTED,
                            borderRadius: "10px",
                            textTransform: "none",
                            fontWeight: 700,
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        onClick={
                            handleGenerateReport
                        }
                        disabled={generating}
                        startIcon={
                            generating
                                ? (
                                    <CircularProgress
                                        size={18}
                                        sx={{
                                            color: BROWN,
                                        }}
                                    />
                                )
                                : (
                                    <PictureAsPdfIcon />
                                )
                        }
                        sx={{
                            px: 3,
                            height: 44,
                            borderRadius: "10px",
                            background:
                                `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
                            color: BROWN,
                            fontWeight: 800,
                            textTransform: "none",
                            "&:hover": {
                                background:
                                    `linear-gradient(135deg, ${GOLD_DARK}, #a97616)`,
                            },
                        }}
                    >
                        {generating
                            ? "Generating..."
                            : "Generate PDF Report"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default ReportsPage;