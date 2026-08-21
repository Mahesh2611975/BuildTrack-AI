import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",

        primary: {
            main: "#dca62f",
            contrastText: "#2d211d",
        },

        secondary: {
            main: "#3b2823",
        },

        background: {
            default: "#fffaf0",
            paper: "#ffffff",
        },

        text: {
            primary: "#2d211d",
            secondary: "#806d61",
        },
    },

    typography: {
        fontFamily:
            '"DM Sans", "Segoe UI", Arial, sans-serif',

        h1: {
            fontFamily:
                '"Playfair Display", Georgia, serif',
            fontWeight: 700,
        },

        h2: {
            fontFamily:
                '"Playfair Display", Georgia, serif',
            fontWeight: 700,
        },

        h3: {
            fontFamily:
                '"Playfair Display", Georgia, serif',
            fontWeight: 700,
        },
    },

    shape: {
        borderRadius: 12,
    },

    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    fontWeight: 700,
                    borderRadius: 10,
                },
            },
        },

        MuiTextField: {
            defaultProps: {
                variant: "outlined",
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
    },
});

export default theme;