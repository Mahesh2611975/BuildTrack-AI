import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import AdvanceForm from "./AdvanceForm";


function AdvanceDialog({
    open,
    handleClose,
    onSubmit,
    advance = null,
}) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                {advance
                    ? "Edit Employee Advance"
                    : "Add Employee Advance"}
            </DialogTitle>

            <DialogContent>

                <AdvanceForm
                    advance={advance}
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}


export default AdvanceDialog;