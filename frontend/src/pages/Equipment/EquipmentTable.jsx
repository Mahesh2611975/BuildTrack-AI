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
        (row) => {

            let rate = "-";

            if (
                row.ownership_type === "Rented" &&
                row.rental_rate != null
            ) {
                rate = `₹${Number(
                    row.rental_rate
                ).toLocaleString("en-IN")} / ${
                    row.rental_rate_unit === "Hour"
                        ? "Hour"
                        : "Day"
                }`;
            }

            if (
                row.ownership_type === "Owned" &&
                row.purchase_cost != null
            ) {
                rate = `₹${Number(
                    row.purchase_cost
                ).toLocaleString("en-IN")}`;
            }

            return {

                id: row.id,

                equipmentCode:
                    row.equipment_code,

                equipmentName:
                    row.equipment_name,

                category:
                    row.category,

                ownership:
                    row.ownership_type || "-",

                rate,

                status: (
                    <StatusChip
                        status={row.status}
                    />
                ),

                actions: (
                    <EquipmentActions
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
            columns={equipmentColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default EquipmentTable;