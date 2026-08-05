import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import { employeeColumns } from "./EmployeeColumns";
import EmployeeActions from "./EmployeeActions";

function EmployeeTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {
    const formattedRows = rows.map((row) => ({
        ...row,
        status: (
            <StatusChip
                status={row.status || "Active"}
            />
        ),
        actions: (
            <EmployeeActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    }));

    return (
        <DataTable
            columns={employeeColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}

export default EmployeeTable;