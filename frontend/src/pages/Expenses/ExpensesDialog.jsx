import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";

import ExpensesForm from "./ExpensesForm";


function ExpensesDialog({
    open,
    handleClose,
    onSubmit,
    expense = null,
}) {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
        >

            <DialogTitle>
                {expense
                    ? "Edit Expense"
                    : "Add Expense"}
            </DialogTitle>

            <DialogContent>

                <ExpensesForm
                    expense={expense}
                    onSubmit={onSubmit}
                />

            </DialogContent>

        </Dialog>
    );
}


export default ExpensesDialog;