import {
    useMemo,
    useState,
} from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import AttendanceTable from "./AttendanceTable";
import AttendanceDialog from "./AttendanceDialog";

import useAttendance from "../../hooks/useAttendance";
import useEmployees from "../../hooks/useEmployees";

import {
    markAttendance,
} from "../../services/attendanceService";


function AttendancePage() {

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);


    const {
        attendance,
        loading,
        refreshAttendance,
    } = useAttendance();


    const {
        employees,
    } = useEmployees();


    const filteredAttendance =
        useMemo(() => {

            const searchValue =
                search
                    .trim()
                    .toLowerCase();


            if (!searchValue) {

                return attendance;

            }


            return attendance.filter(
                (record) => {

                    const employee =
                        employees.find(
                            (item) =>
                                item.id ===
                                record.employee_id
                        );


                    return (

                        employee?.employee_id
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        employee?.full_name
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        record.date
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                        ||

                        record.status
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            )

                    );

                }
            );

        }, [
            attendance,
            employees,
            search,
        ]);


    const handleSubmit =
        async (data) => {

            try {

                await markAttendance(data);


                alert(
                    "Attendance marked successfully"
                );


                setOpen(false);


                await refreshAttendance();

            } catch (error) {

                console.error(
                    "Attendance operation failed:",
                    error
                );


                const message =
                    error.response?.data?.message ||
                    error.response?.data?.detail ||
                    "Failed to mark attendance";


                alert(message);

            }

        };


    return (

        <>

            <PageHeader
                title="Attendance"
                subtitle="Manage employee attendance"
                buttonText="Mark Attendance"
                onClick={() =>
                    setOpen(true)
                }
            />


            <SearchBar
                value={search}
                onChange={(event) =>
                    setSearch(
                        event.target.value
                    )
                }
                placeholder="Search attendance..."
            />


            <AttendanceTable
                rows={
                    filteredAttendance
                }
                employees={employees}
                loading={loading}
            />


            <AttendanceDialog
                open={open}
                handleClose={() =>
                    setOpen(false)
                }
                onSubmit={
                    handleSubmit
                }
                employees={employees}
            />

        </>

    );
}


export default AttendancePage;