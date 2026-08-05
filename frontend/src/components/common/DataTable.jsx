import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

function DataTable({
    columns,
    rows,
}) {
    return (
        <TableContainer
            component={Paper}
            sx={{
                borderRadius: 3,
            }}
        >
            <Table>

                <TableHead>

                    <TableRow>

                        {columns.map((column) => (

                            <TableCell
                                key={column.field}
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {column.headerName}
                            </TableCell>

                        ))}

                    </TableRow>

                </TableHead>

                <TableBody>

                    {rows.map((row, index) => (

                        <TableRow key={index} hover>

                            {columns.map((column) => (

                                <TableCell key={column.field}>

                                    {row[column.field]}

                                </TableCell>

                            ))}

                        </TableRow>

                    ))}

                </TableBody>

            </Table>
        </TableContainer>
    );
}

export default DataTable;