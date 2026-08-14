import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import EquipmentForm from "./EquipmentForm";

function EquipmentDialog({
    open,
    handleClose,
    onSubmit,
    equipment = null,
}) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                {equipment
                    ? "Edit Equipment"
                    : "Add Equipment"}
            </DialogTitle>

            <DialogContent>

                <EquipmentForm
                    equipment={equipment}
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}

export default EquipmentDialog;