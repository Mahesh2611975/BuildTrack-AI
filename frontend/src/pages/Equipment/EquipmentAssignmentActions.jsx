import {
    IconButton,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";


function EquipmentAssignmentActions({
    row,
    onEdit,
}) {

    return (
        <Tooltip title="Edit Assignment">

            <IconButton
                color="primary"
                onClick={() => onEdit(row)}
            >
                <EditIcon />
            </IconButton>

        </Tooltip>
    );
}


export default EquipmentAssignmentActions;