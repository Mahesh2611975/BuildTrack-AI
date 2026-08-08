import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import AttendanceForm from "./AttendanceForm";


function AttendanceDialog({
    open,
    handleClose,
    onSubmit,
    employees = [],
}) {

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >

            <DialogTitle
                sx={{
                    fontWeight: "bold",
                }}
            >
                Mark Attendance
            </DialogTitle>


            <DialogContent>

                <AttendanceForm
                    employees={employees}
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}


export default AttendanceDialog;