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
    rows = [],
    loading = false,
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
                    {loading ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                align="center"
                            >
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                align="center"
                            >
                                No Data Found
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => (
                            <TableRow
                                key={row.id}
                                hover
                            >
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.field}
                                    >
                                        {row[column.field]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default DataTable;