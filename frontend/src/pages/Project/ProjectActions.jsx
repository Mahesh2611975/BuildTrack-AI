import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ProjectActions({ row, onEdit, onDelete }) {
    return (
        <>
            <Tooltip title="Edit Project">
                <IconButton
                    color="primary"
                    onClick={() => onEdit(row)}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Delete Project">
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

export default ProjectActions;