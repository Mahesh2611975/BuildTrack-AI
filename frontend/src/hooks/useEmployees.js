import {
    useEffect,
    useState,
} from "react";

import {
    getEmployees,
} from "../services/employeeService";


function useEmployees() {

    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(true);


    const fetchEmployees = async () => {

        try {

            setLoading(true);

            const response =
                await getEmployees();

            setEmployees(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to fetch employees:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchEmployees();

    }, []);


    return {
        employees,
        loading,
        refreshEmployees:
            fetchEmployees,
    };
}


export default useEmployees;