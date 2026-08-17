import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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
import { useNavigate } from "react-router-dom";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const drawerWidth = 240;

const menuItems = [
    {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/",
    },
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
        text: "Projects",
        icon: <BusinessIcon />,
        path: "/projects",
    },
    {
        text: "Materials",
        icon: <InventoryIcon />,
        path: "/materials",
    },
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
        text: "Payroll",
        icon: <PaymentsIcon />,
        path: "/payroll",
    },
    {
        text: "Reports",
        icon: <DescriptionIcon />,
        path: "/reports",
    },
];

function Sidebar() {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,

                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <List sx={{ mt: 1 }}>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        disablePadding
                    >
                        <ListItemButton
                            onClick={() =>
                                navigate(item.path)
                            }
                        >
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>

                            <ListItemText
                                primary={item.text}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;