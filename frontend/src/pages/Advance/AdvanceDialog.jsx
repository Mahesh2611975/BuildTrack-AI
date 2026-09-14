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
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.22)",
                    overflow: "hidden",
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: {
                        xs: "22px",
                        sm: "26px",
                    },
                    fontWeight: 700,
                    color: "#35241e",
                    padding: {
                        xs: "22px 24px 12px",
                        sm: "26px 28px 14px",
                    },
                }}
            >
                {advance
                    ? "Edit Employee Advance"
                    : "Add Employee Advance"}
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: {
                        xs: "12px 24px 24px !important",
                        sm: "14px 28px 28px !important",
                    },
                }}
            >
                <AdvanceForm
                    advance={advance}
                    onSubmit={onSubmit}
                    onCancel={handleClose}
                />
            </DialogContent>
        </Dialog>
    );
}

export default AdvanceDialog;