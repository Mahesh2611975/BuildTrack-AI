import { useEffect, useState } from "react";

import {
    getAdvances,
} from "../services/advanceService";


function useAdvances() {

    const [advances, setAdvances] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const fetchAdvances = async () => {

        setLoading(true);

        try {

            const response =
                await getAdvances();

            console.log(
                "ADVANCES:",
                response.data
            );

            setAdvances(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to fetch advances:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchAdvances();

    }, []);


    return {
        advances,
        loading,
        refreshAdvances:
            fetchAdvances,
    };
}


export default useAdvances;