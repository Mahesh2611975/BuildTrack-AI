import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";
import { employeeColumns } from "./EmployeeColumns";

function EmployeeTable({ rows = [], loading }) {
    const formattedRows = rows.length
        ? rows.map((row) => ({
              ...row,
              status: <StatusChip status={row.status} />,
          }))
        : [
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
            columns={employeeColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}

export default EmployeeTable;