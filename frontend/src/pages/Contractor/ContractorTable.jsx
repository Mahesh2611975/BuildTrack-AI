import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import { contractorColumns } from "./ContractorColumns";
import ContractorActions from "./ContractorActions";

function ContractorTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {
    const formattedRows = rows.map((row) => ({
        id: row.id,

        contractorId: row.contractor_id,

        companyName: row.company_name,

        contractorName: row.contractor_name,

        mobileNumber: row.mobile_number,

        email: row.email || "-",

        experience: `${row.experience_years} years`,

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
            <ContractorActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    }));

    return (
        <DataTable
            columns={contractorColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}

export default ContractorTable;