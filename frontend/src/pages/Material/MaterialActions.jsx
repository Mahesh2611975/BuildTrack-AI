import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function MaterialActions({
    row,
    onEdit,
    onDelete,
}) {
    return (
        <>
            <Tooltip title="Edit Material">
                <IconButton
                    color="primary"
                    onClick={() => onEdit(row)}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Delete Material">
                <IconButton
                    color="error"
                    onClick={() => onDelete(row)}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}

export default MaterialActions;