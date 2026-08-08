import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import EmployeeForm from "./EmployeeForm";


function EmployeeDialog({
    open,
    handleClose,
    onSubmit,
    employee = null,
}) {

    return (

        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle
                sx={{
                    fontWeight: "bold",
                }}
            >
                {employee
                    ? "Edit Employee"
                    : "Add Employee"}
            </DialogTitle>


            <DialogContent>

                <EmployeeForm
                    employee={employee}
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}


export default EmployeeDialog;