import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import EquipmentAssignmentForm from "./EquipmentAssignmentForm";


function EquipmentAssignmentDialog({
    open,
    handleClose,
    onSubmit,
    assignment = null,
}) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                {assignment
                    ? "Edit Equipment Assignment"
                    : "Assign Equipment"}
            </DialogTitle>

            <DialogContent>

                <EquipmentAssignmentForm
                    assignment={assignment}
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}


export default EquipmentAssignmentDialog;