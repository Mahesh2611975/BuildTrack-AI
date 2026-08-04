import {
    Box,
    Typography,
    Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

function PageHeader({
    title,
    subtitle,
    buttonText,
    onClick,
}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
            }}
        >
            <Box>
                <Typography
                    variant="h4"
                    fontWeight="bold"
                >
                    {title}
                </Typography>

                <Typography
                    color="text.secondary"
                >
                    {subtitle}
                </Typography>
            </Box>

            {buttonText && (
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onClick}
                    sx={{
                        borderRadius: 3,
                        textTransform: "none",
                        px: 3,
                    }}
                >
                    {buttonText}
                </Button>
            )}
        </Box>
    );
}

export default PageHeader;