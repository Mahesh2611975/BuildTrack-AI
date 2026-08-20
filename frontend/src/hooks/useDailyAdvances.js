import { useEffect, useState } from "react";

import {
    getDailyAdvances,
} from "../services/dailyAdvanceService";


function useDailyAdvances() {

    const [
        transactions,
        setTransactions,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);


    const fetchTransactions = async () => {

        try {

            setLoading(true);

            const data =
                await getDailyAdvances();

            setTransactions(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to load daily advances:",
                error
            );

            setTransactions([]);

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchTransactions();

    }, []);


    return {
        transactions,
        loading,
        refreshTransactions:
            fetchTransactions,
    };
}


export default useDailyAdvances;