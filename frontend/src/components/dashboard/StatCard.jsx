import { Card, CardContent, Typography, Box } from "@mui/material";

function StatCard({ title, value, icon }) {
    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 3,
                height: 150,
                display: "flex",
                alignItems: "center",
                transition: "0.3s",
                "&:hover": {
                    transform: "translateY(-5px)",
                },
            }}
        >
            <CardContent
                sx={{
                    width: "100%",
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Box>
                        <Typography
                            color="text.secondary"
                            variant="body2"
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            mt={2}
                        >
                            {value}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            bgcolor: "#1976d2",
                            color: "white",
                            p: 2,
                            borderRadius: "50%",
                        }}
                    >
                        {icon}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default StatCard;