import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

function EmployeeTable() {

    const columns = [
        { field: "employeeId", headerName: "Employee ID" },
        { field: "name", headerName: "Name" },
        { field: "designation", headerName: "Designation" },
        { field: "phone", headerName: "Phone" },
        { field: "status", headerName: "Status" },
    ];

    const rows = [
        {
            employeeId: "EMP001",
            name: "Mahesh",
            designation: "Site Engineer",
            phone: "9876543210",
            status: <StatusChip status="Active" />,
        },
        {
            employeeId: "EMP002",
            name: "Rahul",
            designation: "Supervisor",
            phone: "9876543211",
            status: <StatusChip status="Pending" />,
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={rows}
        />
    );
}

export default EmployeeTable;