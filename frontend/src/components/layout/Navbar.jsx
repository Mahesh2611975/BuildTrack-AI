import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
} from "@mui/material";

function Navbar() {
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: 1201,
            }}
        >
            <Toolbar>
                <Typography variant="h6">
                    BuildTrack AI
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Avatar>M</Avatar>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;