import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import { advanceColumns } from "./AdvanceColumns";
import AdvanceActions from "./AdvanceActions";


function AdvanceTable({
    rows = [],
    employees = [],
    loading,
    onEdit,
    onDelete,
}) {

    const formattedRows = rows.map((row) => {

        const employee =
            employees.find(
                (employee) =>
                    employee.id === row.employee_id
            );


        const employeeDisplay =
            employee
                ? (
                    <div>
                        <div
                            style={{
                                fontWeight: 600,
                                color: "#35241e",
                            }}
                        >
                            {employee.full_name}
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                                color: "#8a7568",
                                marginTop: "3px",
                            }}
                        >
                            {employee.employee_id}
                        </div>
                    </div>
                )
                : `Employee #${row.employee_id}`;


        return {

            id: row.id,


            advanceCode:
                row.advance_code || "-",


            employee:
                employeeDisplay,


            amount:
                row.amount != null
                    ? `₹${Number(
                        row.amount
                    ).toLocaleString("en-IN")}`
                    : "-",


            remainingAmount:
                row.remaining_amount != null
                    ? `₹${Number(
                        row.remaining_amount
                    ).toLocaleString("en-IN")}`
                    : "-",


            advanceDate:
                row.advance_date || "-",


            reason:
                row.reason || "-",


            status: (
                <StatusChip
                    status={
                        row.status
                    }
                />
            ),


            actions: (
                <AdvanceActions
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),

        };
    });


    return (
        <DataTable
            columns={advanceColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default AdvanceTable;