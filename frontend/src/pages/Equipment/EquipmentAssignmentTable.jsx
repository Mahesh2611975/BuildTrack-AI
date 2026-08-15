import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import {
    equipmentAssignmentColumns,
} from "./EquipmentAssignmentColumns";

import EquipmentAssignmentActions from "./EquipmentAssignmentActions";


function EquipmentAssignmentTable({
    rows = [],
    loading,
    onEdit,
}) {

    const formattedRows = rows.map(
        (row) => ({

            id: row.id,

            assignmentId:
                row.id,

            equipmentId:
                row.equipment_id,

            projectId:
                row.project_id,

            assignedDate:
                row.assigned_date || "-",

            expectedReturnDate:
                row.expected_return_date || "-",

            status: (
                <StatusChip
                    status={
                        row.status
                    }
                />
            ),

            actions: (
                <EquipmentAssignmentActions
                    row={row}
                    onEdit={onEdit}
                />
            ),

        })
    );


    return (
        <DataTable
            columns={
                equipmentAssignmentColumns
            }
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default EquipmentAssignmentTable;