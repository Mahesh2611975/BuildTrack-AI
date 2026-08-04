import { Card, CardContent, Typography } from "@mui/material";

function StatCard({ title, value }) {
    return (
        <Card
            sx={{
                borderRadius: 3,
                boxShadow: 3,
                height: 140,
            }}
        >
            <CardContent>
                <Typography color="text.secondary">
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight="bold"
                    mt={2}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default StatCard;