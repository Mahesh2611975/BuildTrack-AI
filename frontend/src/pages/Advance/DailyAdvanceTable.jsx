import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
} from "@mui/material";


function DailyAdvanceTable({
    rows = [],
    employees = [],
    loading = false,
}) {

    const getEmployeeName = (
        employeeId
    ) => {

        const employee =
            employees.find(
                (item) =>
                    item.id === employeeId
            );

        if (!employee) {

            return `Employee #${employeeId}`;
        }

        return `${employee.full_name} (${employee.employee_id})`;
    };


    const total = rows.reduce(
        (sum, transaction) =>
            sum +
            Number(
                transaction.amount || 0
            ),
        0
    );


    return (

        <div style={{ marginTop: "30px" }}>

            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 700,
                }}
            >
                Daily Advance History
            </Typography>


            <TableContainer
                component={Paper}
            >

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                Employee
                            </TableCell>

                            <TableCell>
                                Date
                            </TableCell>

                            <TableCell>
                                Reason
                            </TableCell>

                            <TableCell align="right">
                                Amount
                            </TableCell>

                        </TableRow>

                    </TableHead>


                    <TableBody>

                        {loading ? (

                            <TableRow>

                                <TableCell
                                    colSpan={4}
                                    align="center"
                                >
                                    <CircularProgress
                                        size={25}
                                    />
                                </TableCell>

                            </TableRow>

                        ) : rows.length === 0 ? (

                            <TableRow>

                                <TableCell
                                    colSpan={4}
                                    align="center"
                                >
                                    No daily advances found
                                </TableCell>

                            </TableRow>

                        ) : (

                            rows.map(
                                (transaction) => (

                                    <TableRow
                                        key={
                                            transaction.id
                                        }
                                    >

                                        <TableCell>
                                            {
                                                getEmployeeName(
                                                    transaction.employee_id
                                                )
                                            }
                                        </TableCell>


                                        <TableCell>
                                            {
                                                transaction.transaction_date
                                            }
                                        </TableCell>


                                        <TableCell>
                                            {
                                                transaction.reason ||
                                                "-"
                                            }
                                        </TableCell>


                                        <TableCell align="right">
                                            ₹
                                            {Number(
                                                transaction.amount || 0
                                            ).toFixed(2)}
                                        </TableCell>

                                    </TableRow>

                                )
                            )

                        )}


                        {!loading &&
                            rows.length > 0 && (

                                <TableRow>

                                    <TableCell
                                        colSpan={3}
                                        align="right"
                                    >
                                        <strong>
                                            Total Daily Advances
                                        </strong>
                                    </TableCell>

                                    <TableCell align="right">

                                        <strong>
                                            ₹
                                            {total.toFixed(2)}
                                        </strong>

                                    </TableCell>

                                </TableRow>
                            )}

                    </TableBody>

                </Table>

            </TableContainer>

        </div>
    );
}


export default DailyAdvanceTable;