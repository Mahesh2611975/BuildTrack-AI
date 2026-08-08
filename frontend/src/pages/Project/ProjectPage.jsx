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

    const [selectedProject, setSelectedProject] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const {
        projects,
        loading,
        refreshProjects,
    } = useProjects();

    // ================================
    // SEARCH
    // ================================

    const filteredProjects = projects.filter((project) => {
        const searchValue = search.toLowerCase().trim();

        if (!searchValue) {
            return true;
        }

        return (
            project.project_id
                ?.toLowerCase()
                .includes(searchValue) ||

            project.project_name
                ?.toLowerCase()
                .includes(searchValue) ||

            project.client_name
                ?.toLowerCase()
                .includes(searchValue) ||

            project.location
                ?.toLowerCase()
                .includes(searchValue) ||

            project.status
                ?.toLowerCase()
                .includes(searchValue)
        );
    });

    // ================================
    // ADD / UPDATE
    // ================================

    const handleSubmit = async (data) => {
        try {
            if (selectedProject) {
                await updateProject(
                    selectedProject.id,
                    data
                );

                alert("Project Updated Successfully");
            } else {
                await createProject(data);

                alert("Project Added Successfully");
            }

            setOpen(false);
            setSelectedProject(null);

            await refreshProjects();

        } catch (error) {
            console.error(
                "PROJECT OPERATION ERROR:",
                error
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Operation Failed"
            );
        }
    };

    // ================================
    // EDIT
    // ================================

    const handleEdit = (project) => {
        setSelectedProject(project);
        setOpen(true);
    };

    // ================================
    // DELETE
    // ================================

    const handleDelete = (project) => {
        setSelectedProject(project);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedProject) {
            return;
        }

        try {
            await deleteProject(
                selectedProject.id
            );

            alert("Project Deleted Successfully");

            setDeleteOpen(false);
            setSelectedProject(null);

            await refreshProjects();

        } catch (error) {
            console.error(
                "DELETE PROJECT ERROR:",
                error
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete project"
            );
        }
    };

    // ================================
    // RENDER
    // ================================

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
                rows={filteredProjects}
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
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedProject(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Project"
                message={
                    selectedProject
                        ? `Are you sure you want to delete "${selectedProject.project_name}"?`
                        : "Are you sure you want to delete this project?"
                }
            />
        </>
    );
}

export default ProjectPage;