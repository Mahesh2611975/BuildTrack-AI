import {
    IconButton,
    Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";


function ExpensesActions({
    row,
    onEdit,
    onDelete,
}) {

    return (
        <>
            <Tooltip title="Edit Expense">

                <IconButton
                    color="primary"
                    onClick={() =>
                        onEdit(row)
                    }
                >
                    <EditIcon />
                </IconButton>

            </Tooltip>


            <Tooltip title="Delete Expense">

                <IconButton
                    color="error"
                    onClick={() =>
                        onDelete(row)
                    }
                >
                    <DeleteIcon />
                </IconButton>

            </Tooltip>
        </>
    );
}


export default ExpensesActions;