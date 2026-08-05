import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import SearchBar from "../../components/common/SearchBar";

function EmployeeToolbar({
    search,
    setSearch,
    onAddEmployee,
}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
                gap: 2,
            }}
        >
            <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
            />

            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={onAddEmployee}
            >
                Add Employee
            </Button>
        </Box>
    );
}

export default EmployeeToolbar;