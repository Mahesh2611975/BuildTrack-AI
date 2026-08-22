import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";


function ConfirmDeleteDialog({
    open,
    onClose,
    onConfirm,
    title = "Delete Employee",
    message = "Are you sure you want to delete this employee?",
}) {

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "18px",
                    backgroundColor: "#fffdf8",
                    boxShadow:
                        "0 20px 50px rgba(45, 33, 29, 0.28)",
                    overflow: "hidden",
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor:
                        "rgba(45, 33, 29, 0.58)",
                    backdropFilter: "blur(2px)",
                },
            }}
        >

            {/* HEADER */}

            <DialogTitle
                sx={{
                    px: 3.5,
                    pt: 3,
                    pb: 1.5,

                    fontFamily:
                        '"Playfair Display", Georgia, serif',

                    fontSize: "25px",
                    fontWeight: 700,

                    color: "#35241e",
                }}
            >
                {title}
            </DialogTitle>


            {/* CONTENT */}

            <DialogContent
                sx={{
                    px: 3.5,
                    pb: 1,
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.8,
                    }}
                >

                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            minWidth: 44,

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",

                            borderRadius: "12px",

                            backgroundColor: "#fff2d6",

                            color: "#c89425",
                        }}
                    >
                        <WarningAmberRoundedIcon
                            sx={{
                                fontSize: 25,
                            }}
                        />
                    </Box>


                    <Typography
                        sx={{
                            pt: 0.4,

                            fontSize: "15px",
                            lineHeight: 1.6,

                            color: "#806c60",
                        }}
                    >
                        {message}
                    </Typography>

                </Box>


                <Typography
                    sx={{
                        mt: 2,

                        fontSize: "12px",

                        color: "#a18d80",

                        backgroundColor: "#faf1df",

                        border:
                            "1px solid #ead9b9",

                        borderRadius: "10px",

                        px: 1.5,
                        py: 1.1,
                    }}
                >
                    This action cannot be undone.
                </Typography>

            </DialogContent>


            {/* ACTION BUTTONS */}

            <DialogActions
                sx={{
                    px: 3.5,
                    py: 2.5,

                    gap: 1,

                    justifyContent: "flex-end",
                }}
            >

                <Button
                    onClick={onClose}
                    sx={{
                        minWidth: 90,

                        borderRadius: "10px",

                        color: "#765c4c",

                        fontWeight: 700,

                        px: 2,

                        "&:hover": {
                            backgroundColor: "#f4ead8",
                        },
                    }}
                >
                    Cancel
                </Button>


                <Button
                    onClick={onConfirm}
                    variant="contained"
                    sx={{
                        minWidth: 95,

                        borderRadius: "10px",

                        backgroundColor: "#b33a32",

                        color: "#ffffff",

                        fontWeight: 700,

                        px: 2,

                        boxShadow:
                            "0 4px 10px rgba(179, 58, 50, 0.22)",

                        "&:hover": {
                            backgroundColor: "#982f29",

                            boxShadow:
                                "0 6px 14px rgba(179, 58, 50, 0.28)",
                        },
                    }}
                >
                    Delete
                </Button>

            </DialogActions>

        </Dialog>
    );
}


export default ConfirmDeleteDialog;