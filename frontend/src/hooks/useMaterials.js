import { useEffect, useState } from "react";
import { getMaterials } from "../services/materialService";

function useMaterials() {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const response = await getMaterials();
            console.log("NEW MATERIALS:", response.data);

            setMaterials(response.data);
        } catch (error) {
            console.error(error);
                
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