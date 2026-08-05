import { Chip } from "@mui/material";

function StatusChip({ status }) {

    const colorMap = {
        Active: "success",
        Completed: "primary",
        Pending: "warning",
        Inactive: "default",
        Rejected: "error",
    };

    return (
        <Chip
            label={status}
            color={colorMap[status] || "default"}
            size="small"
            sx={{
                fontWeight: 600,
                borderRadius: 2,
            }}
        />
    );
}

export default StatusChip;