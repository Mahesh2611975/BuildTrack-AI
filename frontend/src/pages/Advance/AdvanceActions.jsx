import {
    IconButton,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


function AdvanceActions({
    row,
    onEdit,
    onDelete,
}) {

    return (
        <>
            <Tooltip title="Edit Advance">
                <IconButton
                    onClick={() => onEdit(row)}
                    sx={{
                        color: "#d59b16",

                        "&:hover": {
                            backgroundColor:
                                "rgba(213,155,22,0.10)",
                        },
                    }}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>


            <Tooltip title="Delete Advance">
                <IconButton
                    onClick={() => onDelete(row)}
                    sx={{
                        color: "#d32f2f",

                        "&:hover": {
                            backgroundColor:
                                "rgba(211,47,47,0.10)",
                        },
                    }}
                >
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </>
    );
}


export default AdvanceActions;