import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import { materialColumns } from "./MaterialColumns";
import MaterialActions from "./MaterialActions";

function MaterialTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {
    const formattedRows = rows.map((row) => ({
        id: row.id,

        materialId: row.material_id,

        materialName: row.material_name,

        category: row.category,

        unit: row.unit,

        stock: row.quantity,

        price: `₹${row.unit_price}`,

        status: (
            <StatusChip
                status={
                    row.quantity > 0
                        ? "In Stock"
                        : "Out of Stock"
                }
            />
        ),

        actions: (
            <MaterialActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    }));

    return (
        <DataTable
            columns={materialColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}

export default MaterialTable;