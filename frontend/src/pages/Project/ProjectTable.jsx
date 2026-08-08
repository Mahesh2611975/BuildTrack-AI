import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";

import { projectColumns } from "./ProjectColumns";
import ProjectActions from "./ProjectActions";

function ProjectTable({
    rows = [],
    loading,
    onEdit,
    onDelete,
}) {
    const formattedRows = rows.map((row) => ({
        id: row.id,

        projectId: row.project_id,

        projectName: row.project_name,

        clientName: row.client_name,

        location: row.location,

        budget: `₹${Number(row.budget).toLocaleString("en-IN")}`,

        status: (
            <StatusChip
                status={row.status}
            />
        ),

        actions: (
            <ProjectActions
                row={row}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        ),
    }));

    return (
        <DataTable
            columns={projectColumns}
            rows={formattedRows}
            loading={loading}
        />
    );
}

export default ProjectTable;