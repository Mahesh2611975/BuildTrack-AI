import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

const data = [
    { month: "Jan", expense: 12000 },
    { month: "Feb", expense: 18000 },
    { month: "Mar", expense: 15000 },
    { month: "Apr", expense: 25000 },
    { month: "May", expense: 22000 },
    { month: "Jun", expense: 30000 },
];

function ExpenseChart() {
    return (
        <Card
    elevation={3}
    sx={{
        width: "100%",
        minHeight: 380,
        borderRadius: 4,
    }}
>
            <CardContent>

                <Typography
                    variant="h6"
                    mb={2}
                >
                    Expense Trend
                </Typography>

                <ResponsiveContainer
                width="100%"
                height={300}
            >
            <LineChart data={data}>

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip />

                        <Line
                            type="monotone"
                            dataKey="expense"
                        />

                    </LineChart>

                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}

export default ExpenseChart;