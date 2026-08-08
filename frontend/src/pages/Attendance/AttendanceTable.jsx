import DataTable from "../../components/common/DataTable";

import StatusChip from "../../components/common/StatusChip";

import {
    attendanceColumns,
} from "./AttendanceColumns";


function AttendanceTable({
    rows = [],
    employees = [],
    loading,
}) {

    const formattedRows = rows.map(
        (row) => {

            const employee =
                employees.find(
                    (item) =>
                        item.id ===
                        row.employee_id
                );


            return {

                id: row.id,

                employeeId:
                    employee?.employee_id ||
                    `ID-${row.employee_id}`,

                employeeName:
                    employee?.full_name ||
                    "Unknown Employee",

                date:
                    row.date,

                status: (
                    <StatusChip
                        status={row.status}
                    />
                ),

            };

        }
    );


    return (
        <DataTable
            columns={attendanceColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default AttendanceTable;