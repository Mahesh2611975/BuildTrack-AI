import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";

const activities = [
    "Employee John added",
    "Material Cement issued",
    "Equipment JCB assigned",
    "Expense ₹25,000 recorded",
];

function RecentActivities() {
    return (
        <Card
            sx={{
                borderRadius: 4,
                height: "100%",
            }}
        >
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Recent Activities
                </Typography>

                <List>
                    {activities.map((activity, index) => (
                        <div key={index}>
                            <ListItem disablePadding>
                                <ListItemText primary={activity} />
                            </ListItem>

                            {index < activities.length - 1 && <Divider />}
                        </div>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}

export default RecentActivities;