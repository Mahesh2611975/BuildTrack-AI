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

    const formattedRows = rows.map(
        (row) => {

            const employee =
                employees.find(
                    (employee) =>
                        employee.id ===
                        row.employee_id
                );


            const employeeDisplay =
                employee
                    ? `${employee.full_name} (${employee.employee_id})`
                    : `Employee #${row.employee_id}`;


            return {

                id: row.id,

                advanceCode:
                    row.advance_code,

                employee:
                    employeeDisplay,

                amount:
                    row.amount != null
                        ? `₹${row.amount}`
                        : "-",

                advanceDate:
                    row.advance_date,

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
        }
    );


    return (
        <DataTable
            columns={advanceColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default AdvanceTable;