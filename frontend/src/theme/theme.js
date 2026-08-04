import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#0f172a",
        },
        background: {
            default: "#f5f7fa",
            paper: "#ffffff",
        },
    },
});

export default theme;