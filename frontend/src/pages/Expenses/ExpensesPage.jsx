import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import ExpensesTable from "./ExpensesTable";
import ExpensesDialog from "./ExpensesDialog";

import useExpenses from "../../hooks/useExpenses";

import {
    createExpense,
    updateExpense,
    deleteExpense,
} from "../../services/expenseService";

function ExpensesPage() {

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [
        selectedExpense,
        setSelectedExpense,
    ] = useState(null);

    const {
        expenses,
        loading,
        refreshExpenses,
    } = useExpenses();


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredExpenses =
        expenses.filter((expense) => {

            const searchText =
                search.toLowerCase();

            return (
                expense.expense_code
                    ?.toLowerCase()
                    .includes(searchText) ||

                expense.category
                    ?.toLowerCase()
                    .includes(searchText) ||

                expense.description
                    ?.toLowerCase()
                    .includes(searchText) ||

                String(expense.project_id)
                    .includes(searchText)
            );
        });


    // ==========================================================
    // CREATE / UPDATE
    // ==========================================================

    const handleSubmit = async (data) => {

        try {

            if (selectedExpense) {

                await updateExpense(
                    selectedExpense.id,
                    data
                );

                alert(
                    "Expense Updated Successfully"
                );

            } else {

                await createExpense(data);

                alert(
                    "Expense Added Successfully"
                );
            }

            setOpen(false);
            setSelectedExpense(null);

            await refreshExpenses();

        } catch (error) {

            console.error(
                "Expense operation failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Expense operation failed"
            );
        }
    };


    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit = (expense) => {

        setSelectedExpense(expense);
        setOpen(true);
    };


    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = async (expense) => {

        const confirmDelete =
            window.confirm(
                `Delete ${expense.expense_code}?`
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteExpense(
                expense.id
            );

            await refreshExpenses();

            alert(
                "Expense Deleted Successfully"
            );

        } catch (error) {

            console.error(
                "Delete expense failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete expense"
            );
        }
    };


    return (
        <>

            <PageHeader
                title="Expenses"
                subtitle="Manage project expenses"
                buttonText="Add Expense"
                onClick={() => {

                    setSelectedExpense(null);
                    setOpen(true);
                }}
            />

            <SearchBar
                value={search}
                onChange={(e) =>
                    setSearch(
                        e.target.value
                    )
                }
                placeholder="Search expenses..."
            />

            <ExpensesTable
                rows={filteredExpenses}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ExpensesDialog
                open={open}
                handleClose={() => {

                    setOpen(false);
                    setSelectedExpense(null);
                }}
                onSubmit={handleSubmit}
                expense={selectedExpense}
            />

        </>
    );
}

export default ExpensesPage;