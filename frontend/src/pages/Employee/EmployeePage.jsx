import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EmployeeTable from "./EmployeeTable";
import EmployeeDialog from "./EmployeeDialog";

import useEmployees from "../../hooks/useEmployees";
import { createEmployee } from "../../services/employeeService";

function EmployeePage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

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
            />

            <EmployeeDialog
                open={open}
                handleClose={() => setOpen(false)}
                onSubmit={handleAddEmployee}
            />
        </>
    );
}

export default EmployeePage;