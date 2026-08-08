import DataTable from "../../components/common/DataTable";

import StatusChip from "../../components/common/StatusChip";

import {
    employeeColumns,
} from "./EmployeeColumns";

import EmployeeActions from "./EmployeeActions";


function EmployeeTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {

    const formattedRows = rows.map(
        (row) => ({

            id: row.id,

            employeeId:
                row.employee_id,

            fullName:
                row.full_name,

            designation:
                row.designation,

            department:
                row.department,

            mobileNumber:
                row.mobile_number,

            status: (
                <StatusChip
                    status={
                        row.is_active
                            ? "Active"
                            : "Inactive"
                    }
                />
            ),

            actions: (
                <EmployeeActions
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),

        })
    );


    return (
        <DataTable
            columns={employeeColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default EmployeeTable;