import {
    Box,
    CircularProgress,
} from "@mui/material";

function LoadingSpinner() {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
            }}
        >
            <CircularProgress />
        </Box>
    );
}

export default LoadingSpinner;