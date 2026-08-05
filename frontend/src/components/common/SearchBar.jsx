import {
    Paper,
    InputBase,
    IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function SearchBar({
    value,
    onChange,
    placeholder = "Search..."
}) {
    return (
        <Paper
            elevation={2}
            sx={{
                display: "flex",
                alignItems: "center",
                px: 2,
                py: 0.5,
                borderRadius: 3,
                width: 350,
            }}
        >
            <InputBase
                sx={{ flex: 1 }}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

            <IconButton>
                <SearchIcon />
            </IconButton>
        </Paper>
    );
}

export default SearchBar;