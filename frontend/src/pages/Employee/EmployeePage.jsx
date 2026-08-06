import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EmployeeTable from "./EmployeeTable";
import EmployeeDialog from "./EmployeeDialog";

import useEmployees from "../../hooks/useEmployees";


import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";
import {
    createEmployee,
    deleteEmployee,
} from "../../services/employeeService";

function EmployeePage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const {
        employees,
        loading,
        refreshEmployees,
    } = useEmployees();

    // Add Employee
    const handleAddEmployee = async (data) => {
        try {
            await createEmployee(data);

            alert("Employee Added Successfully");

            setOpen(false);

            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Failed to add employee");
        }
    };

    // Edit
    const handleEdit = (employee) => {
        console.log("Edit:", employee);
    };

    // Delete
    const handleDelete = (employee) => {
        console.log("Delete Clicked:");
        console.log(employee);
        console.log("Employee ID:", employee.id);
        console.log("All Keys:", Object.keys(employee));

        setSelectedEmployee(employee);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteEmployee(selectedEmployee.id);

            alert("Employee deleted successfully");

            setDeleteOpen(false);

            refreshEmployees();
        } catch (error) {
            console.error(error);

            alert("Failed to delete employee");
        }
    };

    return (
        <>
            <PageHeader
                title="Employees"
                subtitle="Manage company employees"
                buttonText="Add Employee"
                onClick={() => setOpen(true)}
            />

            <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
            />

            <EmployeeTable
                rows={employees}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EmployeeDialog
                open={open}
                handleClose={() => setOpen(false)}
                onSubmit={handleAddEmployee}
            />

            <ConfirmDeleteDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Employee"
                message="Are you sure you want to delete this employee?"
            />
        </>
    );
}

export default EmployeePage;