import { useEffect, useState } from "react";

import { getEquipment } from "../services/equipmentService";

function useEquipment() {

    const [equipment, setEquipment] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchEquipment = async () => {

        setLoading(true);

        try {

            const response = await getEquipment();

            console.log(
                "EQUIPMENT:",
                response.data
            );

            setEquipment(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load equipment:",
                error
            );

            setEquipment([]);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchEquipment();
    }, []);

    return {
        equipment,
        loading,
        refreshEquipment: fetchEquipment,
    };
}

export default useEquipment;