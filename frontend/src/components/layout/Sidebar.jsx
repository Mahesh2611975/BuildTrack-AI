import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PaymentsIcon from "@mui/icons-material/Payments";
import DescriptionIcon from "@mui/icons-material/Description";

const drawerWidth = 240;

const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    { text: "Employees", icon: <PeopleIcon /> },
    { text: "Projects", icon: <BusinessIcon /> },
    { text: "Materials", icon: <InventoryIcon /> },
    { text: "Equipment", icon: <EngineeringIcon /> },
    { text: "Payroll", icon: <PaymentsIcon /> },
    { text: "Reports", icon: <DescriptionIcon /> },
];

function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                "& .MuiDrawer-paper": {
                    width: drawerWidth,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar>
                <h2>🏗 BuildTrack</h2>
            </Toolbar>

            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;