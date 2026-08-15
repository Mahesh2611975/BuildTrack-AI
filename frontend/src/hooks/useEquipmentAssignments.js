import { useEffect, useState } from "react";

import {
    getEquipmentAssignments,
} from "../services/equipmentAssignmentService";


function useEquipmentAssignments() {

    const [assignments, setAssignments] = useState([]);

    const [loading, setLoading] = useState(true);


    // ==========================================================
    // FETCH ASSIGNMENTS
    // ==========================================================

    const fetchAssignments = async () => {

        setLoading(true);

        try {

            const response =
                await getEquipmentAssignments();

            console.log(
                "EQUIPMENT ASSIGNMENTS:",
                response.data
            );

            setAssignments(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to fetch equipment assignments:",
                error
            );

            setAssignments([]);

        } finally {

            setLoading(false);

        }
    };


    // ==========================================================
    // INITIAL LOAD
    // ==========================================================

    useEffect(() => {

        fetchAssignments();

    }, []);


    return {
        assignments,
        loading,
        refreshAssignments:
            fetchAssignments,
    };
}


export default useEquipmentAssignments;