import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import ProjectTable from "./ProjectTable";
import ProjectDialog from "./ProjectDialog";

import useProjects from "../../hooks/useProjects";

import {
    createProject,
    updateProject,
    deleteProject,
} from "../../services/projectService";

import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";
function ProjectPage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [selectedProject, setSelectedProject] =
        useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const {
        projects,
        loading,
        refreshProjects,
    } = useProjects();

    // Add or Update
    const handleSubmit = async (data) => {
        try {
            if (selectedProject) {
                await updateProject(
                    selectedProject.id,
                    data
                );

                alert(
                    "Project Updated Successfully"
                );
            } else {
                await createProject(data);

                alert(
                    "Project Added Successfully"
                );
            }

            setOpen(false);
            setSelectedProject(null);

            refreshProjects();
        } catch (error) {
            console.error(error);
            alert("Operation Failed");
        }
    };

    // Edit
    const handleEdit = (project) => {
        setSelectedProject(project);
        setOpen(true);
    };

    // Delete
    const handleDelete = (project) => {
        setSelectedProject(project);
        setDeleteOpen(true);
    };
    
    const confirmDelete = async () => {
        try {
            await deleteProject(selectedProject.id);

            alert("Project Deleted Successfully");

            setDeleteOpen(false);
            setSelectedProject(null);

            refreshProjects();
        } catch (error) {
            console.error(error);
            alert("Failed to delete project");
        }
    };
    return (
        <>
            <PageHeader
                title="Projects"
                subtitle="Manage construction projects"
                buttonText="Add Project"
                onClick={() => {
                    setSelectedProject(null);
                    setOpen(true);
                }}
            />

            <SearchBar
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
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
                handleClose={() => {
                    setOpen(false);
                    setSelectedProject(null);
                }}
                onSubmit={handleSubmit}
                project={selectedProject}
            />

            <ConfirmDeleteDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
            />
            
        </>
    );
}

export default ProjectPage;