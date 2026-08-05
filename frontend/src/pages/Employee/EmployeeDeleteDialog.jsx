import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

function EmployeeDeleteDialog({
    open,
    handleClose,
}) {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
        >
            <DialogTitle>Delete Employee</DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to delete this employee?
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EmployeeDeleteDialog;