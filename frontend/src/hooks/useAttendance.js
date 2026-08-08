import {
    useEffect,
    useState,
} from "react";

import {
    getAttendance,
} from "../services/attendanceService";

function useAttendance() {

    const [attendance, setAttendance] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    const fetchAttendance = async () => {

        try {

            setLoading(true);

            const response =
                await getAttendance();

            setAttendance(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Failed to fetch attendance:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchAttendance();

    }, []);


    return {
        attendance,
        loading,
        refreshAttendance:
            fetchAttendance,
    };
}

export default useAttendance;