import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import { equipmentColumns } from "./EquipmentColumns";
import EquipmentActions from "./EquipmentActions";

function EquipmentTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {

    const formattedRows = rows.map(
        (row) => ({

            id: row.id,

            equipmentCode:
                row.equipment_code,

            equipmentName:
                row.equipment_name,

            category:
                row.category,

            manufacturer:
                row.manufacturer || "-",

            purchaseCost:
                row.purchase_cost != null
                    ? `₹${row.purchase_cost}`
                    : "-",

            status: (
                <StatusChip
                    status={
                        row.status
                    }
                />
            ),

            actions: (
                <EquipmentActions
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),
        })
    );

    return (
        <DataTable
            columns={equipmentColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}

export default EquipmentTable;