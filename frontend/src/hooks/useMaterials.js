import { useEffect, useState } from "react";
import { getMaterials } from "../services/materialService";

function useMaterials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaterials = async () => {
        try {
            const response = await getMaterials();

            setMaterials(response.data);
        } catch (error) {
            console.error(
                "Failed to fetch materials",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMaterials();
    }, []);

    return {
        materials,
        loading,
        refreshMaterials: fetchMaterials,
    };
}

export default useMaterials;