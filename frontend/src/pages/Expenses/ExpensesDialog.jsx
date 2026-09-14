import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ExpensesForm from "./ExpensesForm";


function ExpensesDialog({
    open,
    handleClose,
    onSubmit,
    expense = null,
}) {
    const isEditMode = Boolean(expense);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: "18px",
                    padding: {
                        xs: "8px",
                        sm: "12px",
                    },
                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
                    overflow: "hidden",
                },
            }}
        >
            {/* ==================================================
                DIALOG HEADER
            ================================================== */}

            <DialogTitle
                sx={{
                    padding: {
                        xs: "18px 20px",
                        sm: "24px 28px",
                    },
                    borderBottom: "1px solid #eee2cf",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                    }}
                >
                    <Box>
                        <Typography
                            component="h2"
                            sx={{
                                fontSize: {
                                    xs: "1.35rem",
                                    sm: "1.6rem",
                                },
                                fontWeight: 700,
                                color: "#352018",
                                lineHeight: 1.3,
                            }}
                        >
                            {isEditMode
                                ? "Edit Expense"
                                : "Add Expense"}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.5,
                                fontSize: "0.9rem",
                                color: "#8b7568",
                            }}
                        >
                            {isEditMode
                                ? "Update the expense details below"
                                : "Enter the details to create a new expense"}
                        </Typography>
                    </Box>

                    <IconButton
                        onClick={handleClose}
                        aria-label="Close dialog"
                        sx={{
                            color: "#6f5a4d",
                            border: "1px solid #eadcc9",
                            borderRadius: "10px",
                            "&:hover": {
                                backgroundColor: "#fff6e6",
                                color: "#b9820c",
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>


            {/* ==================================================
                DIALOG CONTENT
            ================================================== */}

            <DialogContent
                sx={{
                    padding: {
                        xs: "20px",
                        sm: "28px",
                    },
                    backgroundColor: "#fffdf9",
                }}
            >
                <ExpensesForm
                    expense={expense}
                    onSubmit={onSubmit}
                    handleClose={handleClose}
                />
            </DialogContent>


            {/* ==================================================
                FALLBACK FOOTER
            ==================================================

            The Cancel button is placed here.
            ExpensesForm should contain only the form fields
            and should not need to create another Cancel button.

            ================================================== */}

            <DialogActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1.5,
                    padding: {
                        xs: "16px 20px 20px",
                        sm: "18px 28px 26px",
                    },
                    borderTop: "1px solid #eee2cf",
                    backgroundColor: "#fffdf9",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        minWidth: "110px",
                        height: "44px",
                        borderRadius: "10px",
                        borderColor: "#c99120",
                        color: "#9b6b0b",
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        "&:hover": {
                            borderColor: "#9b6b0b",
                            backgroundColor: "#fff7e8",
                        },
                    }}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ExpensesDialog;