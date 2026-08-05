import {
    Box,
    Typography,
} from "@mui/material";

import InboxIcon from "@mui/icons-material/Inbox";

function EmptyState({
    message = "No data available"
}) {
    return (
        <Box
            sx={{
                textAlign: "center",
                py: 6,
            }}
        >
            <InboxIcon
                sx={{
                    fontSize: 60,
                    color: "gray",
                }}
            />

            <Typography
                color="text.secondary"
            >
                {message}
            </Typography>
        </Box>
    );
}

export default EmptyState;