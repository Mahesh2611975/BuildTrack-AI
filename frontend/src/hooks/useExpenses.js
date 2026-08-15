import { useEffect, useState } from "react";

import { getExpenses } from "../services/expenseService";

function useExpenses() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        setLoading(true);

        try {
            const response = await getExpenses();

            console.log(
                "EXPENSES:",
                response.data
            );

            setExpenses(response.data || []);

        } catch (error) {

            console.error(
                "Failed to fetch expenses:",
                error
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return {
        expenses,
        loading,
        refreshExpenses: fetchExpenses,
    };
}

export default useExpenses;