import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EmployeeTable from "./EmployeeTable";
import EmployeeDialog from "./EmployeeDialog";

function EmployeePage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

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

            <EmployeeTable />

            <EmployeeDialog
                open={open}
                handleClose={() => setOpen(false)}
            />
        </>
    );
}

export default EmployeePage;