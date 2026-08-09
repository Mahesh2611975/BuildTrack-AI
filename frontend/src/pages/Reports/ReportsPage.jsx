import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import api from "../../services/api";

import {
    downloadEmployeeReport,
    downloadProjectReport,
    downloadAttendanceReport,
    getManagementSummary,
} from "../../services/reportService";


function ReportsPage() {

    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);


    // =====================================================
    // LOAD MANAGEMENT SUMMARY
    // =====================================================

    useEffect(() => {

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

        fetchSummary();

    }, []);


    // =====================================================
    // DOWNLOAD PDF HELPER
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
    // EMPLOYEE REPORT
    // =====================================================

    const handleEmployeeReport = async () => {

        const employeeId =
            prompt(
                "Enter Employee Database ID:"
            );

        if (!employeeId) {
            return;
        }

        try {

            const response =
                await downloadEmployeeReport(
                    employeeId
                );

            downloadPdf(
                response,
                `Employee_${employeeId}.pdf`
            );

        } catch (error) {

            console.error(
                "Failed to download employee report:",
                error
            );

            alert(
                "Failed to download employee report"
            );

        }

    };


    // =====================================================
    // PROJECT REPORT
    // =====================================================

    const handleProjectReport = async () => {

        const projectId =
            prompt(
                "Enter Project Database ID:"
            );

        if (!projectId) {
            return;
        }

        try {

            const response =
                await downloadProjectReport(
                    projectId
                );

            downloadPdf(
                response,
                `Project_${projectId}.pdf`
            );

        } catch (error) {

            console.error(
                "Failed to download project report:",
                error
            );

            alert(
                "Failed to download project report"
            );

        }

    };


    // =====================================================
    // ATTENDANCE REPORT
    // =====================================================

    const handleAttendanceReport = async () => {

        const employeeId =
            prompt(
                "Enter Employee Database ID:"
            );

        if (!employeeId) {
            return;
        }

        const year =
            prompt(
                "Enter Year:",
                new Date().getFullYear()
            );

        if (!year) {
            return;
        }

        const month =
            prompt(
                "Enter Month (1-12):",
                new Date().getMonth() + 1
            );

        if (!month) {
            return;
        }

        try {

            const response =
                await downloadAttendanceReport(
                    employeeId,
                    year,
                    month
                );

            downloadPdf(
                response,
                `Attendance_${employeeId}_${year}_${month}.pdf`
            );

        } catch (error) {

            console.error(
                "Failed to download attendance report:",
                error
            );

            alert(
                "Failed to download attendance report"
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "400px",
                }}
            >

                <CircularProgress />

            </Box>

        );

    }


    return (

        <Box sx={{ p: 3 }}>

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <Box sx={{ mb: 4 }}>

                <Typography
                    variant="h4"
                    fontWeight="600"
                >
                    Reports
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    View management insights and generate reports
                </Typography>

            </Box>


            {/* ================================================= */}
            {/* SUMMARY CARDS */}
            {/* ================================================= */}

            <Grid
                container
                spacing={3}
                sx={{ mb: 4 }}
            >

                {/* Total Employees */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <PeopleIcon
                                sx={{
                                    fontSize: 40,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                color="text.secondary"
                            >
                                Total Employees
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="700"
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

                    <Card>

                        <CardContent>

                            <EngineeringIcon
                                sx={{
                                    fontSize: 40,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                color="text.secondary"
                            >
                                Active Employees
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="700"
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


                {/* Total Projects */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <AssessmentIcon
                                sx={{
                                    fontSize: 40,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                color="text.secondary"
                            >
                                Total Projects
                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="700"
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


                {/* Total Budget */}

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                >

                    <Card>

                        <CardContent>

                            <AccountBalanceIcon
                                sx={{
                                    fontSize: 40,
                                    mb: 1,
                                }}
                            />

                            <Typography
                                color="text.secondary"
                            >
                                Project Budget
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight="700"
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
            {/* PROJECT STATUS */}
            {/* ================================================= */}

            <Card sx={{ mb: 4 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        fontWeight="600"
                        sx={{ mb: 2 }}
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

                            <Typography>
                                Planned
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight="700"
                            >
                                {
                                    summary
                                        ?.projects
                                        ?.planned ?? 0
                                }
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography>
                                In Progress
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight="700"
                            >
                                {
                                    summary
                                        ?.projects
                                        ?.in_progress ?? 0
                                }
                            </Typography>

                        </Grid>


                        <Grid
                            item
                            xs={12}
                            md={4}
                        >

                            <Typography>
                                Completed
                            </Typography>

                            <Typography
                                variant="h5"
                                fontWeight="700"
                            >
                                {
                                    summary
                                        ?.projects
                                        ?.completed ?? 0
                                }
                            </Typography>

                        </Grid>

                    </Grid>

                </CardContent>

            </Card>


            {/* ================================================= */}
            {/* PDF REPORTS */}
            {/* ================================================= */}

            <Typography
                variant="h6"
                fontWeight="600"
                sx={{ mb: 2 }}
            >
                PDF Reports
            </Typography>


            <Grid
                container
                spacing={3}
            >

                {/* Employee Report */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card>

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight="600"
                            >
                                Employee Report
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                    mt: 1,
                                }}
                            >
                                Generate a detailed employee PDF report.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={
                                    <PictureAsPdfIcon />
                                }
                                fullWidth
                                onClick={
                                    handleEmployeeReport
                                }
                            >
                                Download Report
                            </Button>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Project Report */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card>

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight="600"
                            >
                                Project Report
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                    mt: 1,
                                }}
                            >
                                Generate a detailed project PDF report.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={
                                    <PictureAsPdfIcon />
                                }
                                fullWidth
                                onClick={
                                    handleProjectReport
                                }
                            >
                                Download Report
                            </Button>

                        </CardContent>

                    </Card>

                </Grid>


                {/* Attendance Report */}

                <Grid
                    item
                    xs={12}
                    md={4}
                >

                    <Card>

                        <CardContent>

                            <Typography
                                variant="h6"
                                fontWeight="600"
                            >
                                Attendance Report
                            </Typography>

                            <Typography
                                color="text.secondary"
                                sx={{
                                    mb: 2,
                                    mt: 1,
                                }}
                            >
                                Generate monthly attendance PDF.
                            </Typography>

                            <Button
                                variant="contained"
                                startIcon={
                                    <PictureAsPdfIcon />
                                }
                                fullWidth
                                onClick={
                                    handleAttendanceReport
                                }
                            >
                                Download Report
                            </Button>

                        </CardContent>

                    </Card>

                </Grid>

            </Grid>

        </Box>
    );
}

export default ReportsPage;