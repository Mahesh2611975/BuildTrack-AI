import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

const data = [
    { name: "Completed", value: 65 },
    { name: "In Progress", value: 25 },
    { name: "Pending", value: 10 },
];

const COLORS = [
    "#4CAF50",
    "#2196F3",
    "#FFC107",
];

function ProjectProgress() {
    return (
        <Card
            sx={{
                height: 350,
                borderRadius: 3,
            }}
        >
            <CardContent>

                <Typography
                    variant="h6"
                    mb={2}
                >
                    Project Progress
                </Typography>

                <ResponsiveContainer
                    width="100%"
                    height={250}
                >
                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="value"
                            outerRadius={80}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={COLORS[index]}
                                />
                            ))}
                        </Pie>

                        <Tooltip />

                    </PieChart>
                </ResponsiveContainer>

            </CardContent>
        </Card>
    );
}

export default ProjectProgress;