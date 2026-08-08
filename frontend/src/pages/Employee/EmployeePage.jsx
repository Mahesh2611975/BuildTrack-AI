import {
    useMemo,
    useState,
} from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EmployeeTable from "./EmployeeTable";
import EmployeeDialog from "./EmployeeDialog";

import useEmployees from "../../hooks/useEmployees";

import {
    createEmployee,
    updateEmployee,
    deleteEmployee,
} from "../../services/employeeService";

import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";


function EmployeePage() {

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [
        selectedEmployee,
        setSelectedEmployee,
    ] = useState(null);

    const [
        deleteOpen,
        setDeleteOpen,
    ] = useState(false);


    const {
        employees,
        loading,
        refreshEmployees,
    } = useEmployees();


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredEmployees = useMemo(() => {

        const searchValue =
            search.trim().toLowerCase();


        if (!searchValue) {
            return employees;
        }


        return employees.filter(
            (employee) => {

                return (

                    employee.employee_id
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.full_name
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.designation
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.department
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.mobile_number
                        ?.toLowerCase()
                        .includes(searchValue)

                    ||

                    employee.email
                        ?.toLowerCase()
                        .includes(searchValue)

                );
            }
        );

    }, [employees, search]);


    // =====================================================
    // ADD / UPDATE
    // =====================================================

    const handleSubmit = async (data) => {
        try {
            if (selectedEmployee) {
                await updateEmployee(
                    selectedEmployee.id,
                    data
                );

                alert(
                    "Employee Updated Successfully"
                );
            } else {
                await createEmployee(data);

                alert(
                    "Employee Added Successfully"
                );
            }

            setOpen(false);
            setSelectedEmployee(null);

            await refreshEmployees();

        } catch (error) {
            console.error(
                "Employee operation failed:",
                error
            );

            const message =
                error.response?.data?.detail ||
                "Operation Failed";

            alert(message);
        }
    };


    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (employee) => {

        setSelectedEmployee(employee);

        setOpen(true);
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (employee) => {

        setSelectedEmployee(employee);

        setDeleteOpen(true);
    };


    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const confirmDelete = async () => {

        if (!selectedEmployee) {
            return;
        }


        try {

            await deleteEmployee(
                selectedEmployee.id
            );


            alert(
                "Employee Deleted Successfully"
            );


            setDeleteOpen(false);

            setSelectedEmployee(null);

            await refreshEmployees();

        } catch (error) {

            console.error(
                "Delete employee failed:",
                error
            );


            const message =
                error.response?.data?.detail ||
                "Failed to delete employee";


            alert(message);
        }
    };


    return (

        <>

            <PageHeader
                title="Employees"
                subtitle="Manage company employees"
                buttonText="Add Employee"
                onClick={() => {

                    setSelectedEmployee(null);

                    setOpen(true);
                }}
            />


            <SearchBar
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                }
                placeholder="Search employees..."
            />


            <EmployeeTable
                rows={filteredEmployees}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            <EmployeeDialog
                open={open}
                handleClose={() => {

                    setOpen(false);

                    setSelectedEmployee(null);
                }}
                onSubmit={handleSubmit}
                employee={selectedEmployee}
            />


            <ConfirmDeleteDialog
                open={deleteOpen}
                onClose={() => {

                    setDeleteOpen(false);

                    setSelectedEmployee(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Employee"
                message={
                    selectedEmployee
                        ? `Are you sure you want to delete ${selectedEmployee.full_name}?`
                        : "Are you sure you want to delete this employee?"
                }
            />

        </>
    );
}


export default EmployeePage;