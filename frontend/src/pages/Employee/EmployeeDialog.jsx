import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import EmployeeForm from "./EmployeeForm";

function EmployeeDialog({ open, handleClose, onSubmit }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >
            <DialogTitle>Add Employee</DialogTitle>

            <DialogContent>
                <EmployeeForm onSubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    );
}

export default EmployeeDialog;