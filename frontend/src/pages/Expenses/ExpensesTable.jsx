import DataTable from "../../components/common/DataTable";

import {
    expensesColumns,
} from "./ExpensesColumns";

import ExpensesActions from "./ExpensesActions";


function ExpensesTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {

    const formattedRows = rows.map(
        (row) => ({

            id: row.id,

            expenseCode:
                row.expense_code,

            projectId:
                row.project_id,

            category:
                row.category,

            amount:
                `₹${Number(row.amount).toLocaleString("en-IN")}`,

            expenseDate:
                row.expense_date || "-",

            description:
                row.description || "-",

            actions: (
                <ExpensesActions
                    row={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ),

        })
    );


    return (
        <DataTable
            columns={expensesColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}


export default ExpensesTable;