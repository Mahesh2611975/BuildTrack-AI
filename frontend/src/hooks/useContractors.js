import { useEffect, useState } from "react";

import {
    getContractors,
} from "../services/contractorService";

function useContractors() {
    const [contractors, setContractors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContractors = async () => {
        try {
            setLoading(true);

            const response =
                await getContractors();

            console.log(
                "Fetched Contractors:",
                response.data
            );

            setContractors(response.data);

        } catch (error) {
            console.error(
                "Failed to fetch contractors:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractors();
    }, []);

    return {
        contractors,
        loading,
        refreshContractors:
            fetchContractors,
    };
}

export default useContractors;