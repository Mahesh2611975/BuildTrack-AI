import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

function useProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProjects = async () => {
        try {
            const response = await getProjects();

            console.log("Projects:", response.data);

            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return {
        projects,
        loading,
        refreshProjects: fetchProjects,
    };
}

export default useProjects;