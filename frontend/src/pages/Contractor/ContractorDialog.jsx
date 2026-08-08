import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import ContractorForm from "./ContractorForm";

function ContractorDialog({
    open,
    handleClose,
    onSubmit,
    contractor = null,
}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {contractor
                    ? "Edit Contractor"
                    : "Add Contractor"}
            </DialogTitle>

            <DialogContent>
                <ContractorForm
                    contractor={contractor}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ContractorDialog;