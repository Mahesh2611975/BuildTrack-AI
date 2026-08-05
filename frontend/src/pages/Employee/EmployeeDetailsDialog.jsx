import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
} from "@mui/material";

function EmployeeDetailsDialog({ open, handleClose }) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Employee Details</DialogTitle>

            <DialogContent>
                <Typography>Name: Mahesh</Typography>
                <Typography>Designation: Site Engineer</Typography>
                <Typography>Phone: 9876543210</Typography>
                <Typography>Status: Active</Typography>
            </DialogContent>
        </Dialog>
    );
}

export default EmployeeDetailsDialog;