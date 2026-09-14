import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";


function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
}) {
    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                marginBottom: "18px",
            }}
        >
            <Box
                sx={{
                    width: {
                        xs: "100%",
                        sm: "420px",
                        md: "460px",
                    },
                    height: "54px",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    backgroundColor: "#ffffff",
                    border: "1px solid #eadfce",
                    borderRadius: "28px",
                    boxShadow: "0 3px 8px rgba(65, 43, 28, 0.08)",
                    transition: "all 0.2s ease",

                    "&:focus-within": {
                        borderColor: "#d69b1c",
                        boxShadow:
                            "0 0 0 3px rgba(214, 155, 28, 0.14)",
                    },
                }}
            >
                <InputBase
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    fullWidth
                    sx={{
                        height: "100%",
                        paddingLeft: "22px",
                        paddingRight: "58px",
                        fontSize: "16px",
                        color: "#352018",

                        "& input": {
                            padding: 0,
                            height: "100%",
                            boxSizing: "border-box",
                        },

                        "& input::placeholder": {
                            color: "#a99b91",
                            opacity: 1,
                        },
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        right: "17px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#6d625b",
                        pointerEvents: "none",
                    }}
                >
                    <SearchIcon
                        sx={{
                            fontSize: "25px",
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default SearchBar;