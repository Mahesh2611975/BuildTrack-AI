import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import MaterialForm from "./MaterialForm";

function MaterialDialog({
    open,
    handleClose,
    onSubmit,
    material = null,
}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>
                {material ? "Edit Material" : "Add Material"}
            </DialogTitle>

            <DialogContent>
                <MaterialForm
                    material={material}
                    onSubmit={onSubmit}
                />
            </DialogContent>
        </Dialog>
    );
}

export default MaterialDialog;