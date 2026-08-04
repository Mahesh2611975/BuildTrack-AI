import {
    Card,
    CardContent,
    Typography,
    Alert,
    Stack,
} from "@mui/material";

function NotificationPanel() {
    return (
        <Card
            sx={{
                borderRadius: 4,
                height: "100%",
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Notifications
                </Typography>

                <Stack spacing={2}>
                    <Alert severity="warning">
                        Low Stock: Cement
                    </Alert>

                    <Alert severity="error">
                        Equipment Maintenance Due
                    </Alert>

                    <Alert severity="info">
                        5 Tasks Pending
                    </Alert>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default NotificationPanel;