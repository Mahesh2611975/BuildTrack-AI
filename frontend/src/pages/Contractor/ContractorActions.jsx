import {
    IconButton,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function ContractorActions({
    row,
    onEdit,
    onDelete,
}) {
    return (
        <>
            {/* Edit */}
            <Tooltip title="Edit Contractor">
                <IconButton
                    color="primary"
                    onClick={() => onEdit(row)}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>

            {/* Delete */}
            <Tooltip title="Delete Contractor">
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

export default ContractorActions;