import { useMemo, useState } from "react";

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
    // ==========================================================
    // STATE
    // ==========================================================

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);

    const {
        expenses = [],
        loading,
        refreshExpenses,
    } = useExpenses();


    // ==========================================================
    // OPEN ADD EXPENSE DIALOG
    // ==========================================================

    const handleAddExpense = () => {
        setSelectedExpense(null);
        setOpen(true);
    };


    // ==========================================================
    // CLOSE DIALOG
    // ==========================================================

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedExpense(null);
    };


    // ==========================================================
    // SEARCH AND FILTER
    // ==========================================================

    const filteredExpenses = useMemo(() => {
        const searchText = search.trim().toLowerCase();

        if (!searchText) {
            return expenses;
        }

        return expenses.filter((expense) => {
            const expenseCode =
                expense.expense_code?.toLowerCase() || "";

            const category =
                expense.category?.toLowerCase() || "";

            const description =
                expense.description?.toLowerCase() || "";

            const projectId =
                String(expense.project_id || "").toLowerCase();

            const amount =
                String(expense.amount || "").toLowerCase();

            const expenseDate =
                String(expense.expense_date || "").toLowerCase();

            return (
                expenseCode.includes(searchText) ||
                category.includes(searchText) ||
                description.includes(searchText) ||
                projectId.includes(searchText) ||
                amount.includes(searchText) ||
                expenseDate.includes(searchText)
            );
        });
    }, [expenses, search]);


    // ==========================================================
    // CREATE / UPDATE EXPENSE
    // ==========================================================

    const handleSubmit = async (data) => {
        try {
            if (selectedExpense) {
                await updateExpense(
                    selectedExpense.id,
                    data
                );

                alert("Expense updated successfully.");
            } else {
                await createExpense(data);

                alert("Expense added successfully.");
            }

            handleCloseDialog();

            await refreshExpenses();

        } catch (error) {
            console.error(
                "Expense operation failed:",
                error
            );

            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Expense operation failed. Please try again.";

            alert(errorMessage);
        }
    };


    // ==========================================================
    // EDIT EXPENSE
    // ==========================================================

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        setOpen(true);
    };


    // ==========================================================
    // DELETE EXPENSE
    // ==========================================================

    const handleDelete = async (expense) => {
        const expenseName =
            expense.expense_code || "this expense";

        const confirmDelete = window.confirm(
            `Are you sure you want to delete ${expenseName}?`
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await deleteExpense(expense.id);

            await refreshExpenses();

            alert("Expense deleted successfully.");

        } catch (error) {
            console.error(
                "Delete expense failed:",
                error
            );

            const errorMessage =
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Failed to delete expense. Please try again.";

            alert(errorMessage);
        }
    };


    // ==========================================================
    // CLEAR SEARCH
    // ==========================================================

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };


    // ==========================================================
    // UI
    // ==========================================================

    return (
        <>
            <PageHeader
                title="Expenses"
                subtitle="Manage project expenses"
                buttonText="Add Expense"
                onClick={handleAddExpense}
            />

            <SearchBar
                value={search}
                onChange={handleSearchChange}
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
                handleClose={handleCloseDialog}
                onSubmit={handleSubmit}
                expense={selectedExpense}
            />
        </>
    );
}

export default ExpensesPage;