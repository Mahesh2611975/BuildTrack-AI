import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    Chip,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const drawerWidth = 275;

function Navbar() {

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                width: `calc(100% - ${drawerWidth}px)`,
                ml: `${drawerWidth}px`,
                backgroundColor: "#fffaf0",
                color: "#2d211d",
                borderBottom:
                    "1px solid #eadfca",
                zIndex: 1201,
            }}
        >

            <Toolbar
                sx={{
                    minHeight: "74px !important",
                    px: {
                        xs: 2,
                        md: 3,
                    },
                }}
            >

                {/* ========================================= */}
                {/* BRAND / PAGE BRAND */}
                {/* ========================================= */}

                <Box>
                    <Typography
                        sx={{
                            fontSize: "22px",
                            fontWeight: 800,
                            color: "#3b2823",
                            lineHeight: 1.1,
                        }}
                    >
                        BuildTrack AI
                    </Typography>

                    <Typography
                        sx={{
                            fontSize: "12px",
                            color: "#8a7568",
                            mt: 0.3,
                        }}
                    >
                        Construction Management Platform
                    </Typography>
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                {/* ========================================= */}
                {/* SYSTEM STATUS */}
                {/* ========================================= */}

                <Chip
                    label="System Online"
                    size="small"
                    sx={{
                        mr: 1.5,
                        backgroundColor:
                            "#e8f6e9",
                        color: "#23843b",
                        border:
                            "1px solid #b9dfbf",
                        fontWeight: 700,
                        "& .MuiChip-label": {
                            px: 1.5,
                        },
                    }}
                />

                {/* ========================================= */}
                {/* REFRESH */}
                {/* ========================================= */}

                <IconButton
                    sx={{
                        color: "#5b4439",
                        mr: 0.5,
                        "&:hover": {
                            backgroundColor:
                                "#f3ead8",
                        },
                    }}
                >
                    <RefreshIcon />
                </IconButton>

                {/* ========================================= */}
                {/* NOTIFICATION */}
                {/* ========================================= */}

                <IconButton
                    sx={{
                        color: "#5b4439",
                        mr: 1,
                        "&:hover": {
                            backgroundColor:
                                "#f3ead8",
                        },
                    }}
                >
                    <NotificationsNoneIcon />
                </IconButton>

                {/* ========================================= */}
                {/* USER */}
                {/* ========================================= */}

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        cursor: "pointer",
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        "&:hover": {
                            backgroundColor:
                                "#f3ead8",
                        },
                    }}
                >

                    <Avatar
                        sx={{
                            width: 42,
                            height: 42,
                            backgroundColor:
                                "#dca62f",
                            color: "#3b2823",
                            fontWeight: 800,
                        }}
                    >
                        M
                    </Avatar>

                    <Box
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block",
                            },
                        }}
                    >

                        <Typography
                            sx={{
                                fontSize: "14px",
                                fontWeight: 800,
                                lineHeight: 1.2,
                            }}
                        >
                            Mahesh
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: "11px",
                                color: "#8a7568",
                            }}
                        >
                            Administrator
                        </Typography>

                    </Box>

                    <KeyboardArrowDownIcon
                        sx={{
                            color: "#765c4c",
                        }}
                    />

                </Box>

            </Toolbar>

        </AppBar>
    );
}

export default Navbar;