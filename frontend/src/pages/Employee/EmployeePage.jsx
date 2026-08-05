import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EmployeeTable from "./EmployeeTable";
import EmployeeDialog from "./EmployeeDialog";

import useEmployees from "../../hooks/useEmployees";
import { createEmployee } from "../../services/employeeService";

import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";

function EmployeePage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const { employees, loading } = useEmployees();

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
        console.log("Delete Clicked", employee);

        setSelectedEmployee(employee);
        setDeleteOpen(true);
    };

    const confirmDelete = () => {
        console.log("Delete Confirmed", selectedEmployee);

        setDeleteOpen(false);
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