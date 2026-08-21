import {
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PaymentsIcon from "@mui/icons-material/Payments";
import DescriptionIcon from "@mui/icons-material/Description";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GroupsIcon from "@mui/icons-material/Groups";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SettingsIcon from "@mui/icons-material/Settings";

import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 275;

const menuGroups = [
    {
        title: "MAIN",
        items: [
            {
                text: "Dashboard",
                icon: <DashboardIcon />,
                path: "/",
            },
        ],
    },

    {
        title: "WORKFORCE",
        items: [
            {
                text: "Employees",
                icon: <PeopleIcon />,
                path: "/employees",
            },
            {
                text: "Attendance",
                icon: <EventAvailableIcon />,
                path: "/attendance",
            },
            {
                text: "Contractors",
                icon: <GroupsIcon />,
                path: "/contractors",
            },
        ],
    },

    {
        title: "PROJECT MANAGEMENT",
        items: [
            {
                text: "Projects",
                icon: <BusinessIcon />,
                path: "/projects",
            },
            {
                text: "Tasks",
                icon: <TaskAltIcon />,
                path: "/tasks",
            },
        ],
    },

    {
        title: "OPERATIONS",
        items: [
            {
                text: "Materials",
                icon: <InventoryIcon />,
                path: "/materials",
            },
            {
                text: "Equipment",
                icon: <EngineeringIcon />,
                path: "/equipment",
            },
            {
                text: "Equipment Assignments",
                icon: <AssignmentIcon />,
                path: "/equipment-assignments",
            },
            {
                text: "Suppliers",
                icon: <LocalShippingIcon />,
                path: "/suppliers",
            },
        ],
    },

    {
        title: "FINANCE",
        items: [
            {
                text: "Expenses",
                icon: <ReceiptLongIcon />,
                path: "/expenses",
            },
            {
                text: "Employee Advances",
                icon: <AccountBalanceWalletIcon />,
                path: "/advances",
            },
            {
                text: "Salary",
                icon: <RequestQuoteIcon />,
                path: "/salary",
            },
            {
                text: "Payroll",
                icon: <PaymentsIcon />,
                path: "/payroll",
            },
        ],
    },

    {
        title: "REPORTING",
        items: [
            {
                text: "Reports",
                icon: <DescriptionIcon />,
                path: "/reports",
            },
        ],
    },

    {
        title: "SYSTEM",
        items: [
            {
                text: "Settings",
                icon: <SettingsIcon />,
                path: "/settings",
            },
        ],
    },
];

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === "/") {
            return location.pathname === "/";
        }

        return (
            location.pathname === path ||
            location.pathname.startsWith(`${path}/`)
        );
    };

    return (
        <Drawer
            variant="permanent"
            className="buildtrack-sidebar"
            sx={{
                width: drawerWidth,
                flexShrink: 0,

                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                    borderRight: "1px solid rgba(255,255,255,0.08)",
                    background:
                        "linear-gradient(180deg, #3b2823 0%, #2b1c19 100%)",
                    color: "#ffffff",
                    overflowX: "hidden",
                },
            }}
        >
            {/* ================================================= */}
            {/* BRAND */}
            {/* ================================================= */}

            <Box className="sidebar-brand">

                <Box className="brand-logo">
                    BT
                </Box>

                <Box>
                    <Typography
                        className="brand-name"
                        component="div"
                    >
                        BuildTrack
                    </Typography>

                    <Typography
                        className="brand-ai"
                        component="div"
                    >
                        AI
                    </Typography>

                    <Typography
                        className="brand-subtitle"
                        component="div"
                    >
                        CONSTRUCTION ERP
                    </Typography>
                </Box>

            </Box>

            <Divider
                sx={{
                    borderColor:
                        "rgba(255,255,255,0.10)",
                }}
            />

            {/* ================================================= */}
            {/* MENU */}
            {/* ================================================= */}

            <Box className="sidebar-menu">

                {menuGroups.map((group) => (
                    <Box
                        key={group.title}
                        className="sidebar-group"
                    >

                        <Typography
                            className="sidebar-group-title"
                        >
                            {group.title}
                        </Typography>

                        <List
                            disablePadding
                        >

                            {group.items.map(
                                (item) => {
                                    const active =
                                        isActive(
                                            item.path
                                        );

                                    return (
                                        <ListItem
                                            key={
                                                item.text
                                            }
                                            disablePadding
                                        >

                                            <ListItemButton
                                                className={
                                                    active
                                                        ? "sidebar-item active"
                                                        : "sidebar-item"
                                                }
                                                onClick={() =>
                                                    navigate(
                                                        item.path
                                                    )
                                                }
                                            >

                                                <ListItemIcon
                                                    className="sidebar-icon"
                                                >
                                                    {
                                                        item.icon
                                                    }
                                                </ListItemIcon>

                                                <ListItemText
                                                    primary={
                                                        item.text
                                                    }
                                                />

                                            </ListItemButton>

                                        </ListItem>
                                    );
                                }
                            )}

                        </List>

                    </Box>
                ))}

            </Box>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <Box className="sidebar-footer">

                <Box className="system-dot" />

                <Box>
                    <Typography
                        className="system-title"
                    >
                        System Online
                    </Typography>

                    <Typography
                        className="system-subtitle"
                    >
                        BuildTrack AI ERP
                    </Typography>
                </Box>

            </Box>

        </Drawer>
    );
}

export default Sidebar;