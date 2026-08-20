import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import DailyAdvanceForm from "./DailyAdvanceForm";


function DailyAdvanceDialog({
    open,
    handleClose,
    onSubmit,
}) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                Add Daily Advance
            </DialogTitle>

            <DialogContent>

                <DailyAdvanceForm
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}


export default DailyAdvanceDialog;