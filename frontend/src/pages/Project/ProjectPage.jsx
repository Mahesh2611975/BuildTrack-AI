import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import ProjectTable from "./ProjectTable";
import ProjectDialog from "./ProjectDialog";

import useProjects from "../../hooks/useProjects";
import { createProject } from "../../services/projectService";

function ProjectPage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const {
        projects,
        loading,
        refreshProjects,
    } = useProjects();

    // Add Project
    const handleAddProject = async (data) => {
        try {
            await createProject(data);

            alert("Project Added Successfully");

            setOpen(false);

            refreshProjects();
        } catch (error) {
            console.error(error);
            alert("Failed to add project");
        }
    };

    // Edit Project
    const handleEdit = (project) => {
        console.log("Edit:", project);
    };

    // Delete Project
    const handleDelete = (project) => {
        console.log("Delete:", project);
    };

    return (
        <>
            <PageHeader
                title="Projects"
                subtitle="Manage construction projects"
                buttonText="Add Project"
                onClick={() => setOpen(true)}
            />

            <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
            />

            <ProjectTable
                rows={projects}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ProjectDialog
                open={open}
                handleClose={() => setOpen(false)}
                onSubmit={handleAddProject}
            />
        </>
    );
}

export default ProjectPage;