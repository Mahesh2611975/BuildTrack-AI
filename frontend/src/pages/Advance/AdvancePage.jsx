import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import AdvanceTable from "./AdvanceTable";
import AdvanceDialog from "./AdvanceDialog";
import DailyAdvanceDialog from "./DailyAdvanceDialog";
import DailyAdvanceTable from "./DailyAdvanceTable";

import useEmployees from "../../hooks/useEmployees";
import useAdvances from "../../hooks/useAdvances";
import useDailyAdvances from "../../hooks/useDailyAdvances";

import {
    createAdvance,
    updateAdvance,
    deleteAdvance,
} from "../../services/advanceService";

import {
    createDailyAdvance,
} from "../../services/dailyAdvanceService";


function AdvancePage() {

    // ==========================================================
    // MAIN ADVANCE STATE
    // ==========================================================

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [
        selectedAdvance,
        setSelectedAdvance,
    ] = useState(null);


    // ==========================================================
    // DAILY ADVANCE STATE
    // ==========================================================

    const [
        dailyAdvanceOpen,
        setDailyAdvanceOpen,
    ] = useState(false);


    // ==========================================================
    // MAIN ADVANCES
    // ==========================================================

    const {
        advances,
        loading,
        refreshAdvances,
    } = useAdvances();


    // ==========================================================
    // DAILY ADVANCES
    // ==========================================================

    const {
        transactions,
        loading: dailyAdvancesLoading,
        refreshTransactions,
    } = useDailyAdvances();


    // ==========================================================
    // EMPLOYEES
    // ==========================================================

    const {
        employees,
        loading: employeesLoading,
    } = useEmployees();


    // ==========================================================
    // SEARCH MAIN ADVANCES
    // ==========================================================

    const filteredAdvances =
        advances.filter((advance) => {

            const searchText =
                search.toLowerCase();

            return (

                advance.advance_code
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                String(
                    advance.employee_id
                )
                    .includes(searchText)

                ||

                advance.reason
                    ?.toLowerCase()
                    .includes(searchText)

                ||

                advance.status
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });


    // ==========================================================
    // CREATE / UPDATE MAIN ADVANCE
    // ==========================================================

    const handleSubmit = async (
        data
    ) => {

        try {

            if (selectedAdvance) {

                await updateAdvance(
                    selectedAdvance.id,
                    data
                );

                alert(
                    "Advance Updated Successfully"
                );

            } else {

                await createAdvance(
                    data
                );

                alert(
                    "Advance Added Successfully"
                );
            }


            setOpen(false);

            setSelectedAdvance(
                null
            );

            await refreshAdvances();

        } catch (error) {

            console.error(
                "Advance operation failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Advance operation failed"
            );
        }
    };


    // ==========================================================
    // CREATE DAILY ADVANCE
    // ==========================================================

    const handleDailyAdvanceSubmit =
        async (data) => {

            try {

                await createDailyAdvance(
                    data
                );

                // Refresh daily advance history
                await refreshTransactions();

                alert(
                    "Daily Advance Added Successfully"
                );

                setDailyAdvanceOpen(
                    false
                );

            } catch (error) {

                console.error(
                    "Daily advance failed:",
                    error
                );

                alert(
                    error.response?.data?.detail ||
                    "Failed to add daily advance"
                );
            }
        };


    // ==========================================================
    // EDIT MAIN ADVANCE
    // ==========================================================

    const handleEdit = (
        advance
    ) => {

        setSelectedAdvance(
            advance
        );

        setOpen(true);
    };


    // ==========================================================
    // DELETE MAIN ADVANCE
    // ==========================================================

    const handleDelete = async (
        advance
    ) => {

        const confirmDelete =
            window.confirm(
                `Delete ${advance.advance_code}?`
            );


        if (!confirmDelete) {
            return;
        }


        try {

            await deleteAdvance(
                advance.id
            );

            await refreshAdvances();

            alert(
                "Advance Deleted Successfully"
            );

        } catch (error) {

            console.error(
                "Delete advance failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete advance"
            );
        }
    };


    // ==========================================================
    // OPEN MAIN ADVANCE
    // ==========================================================

    const handleOpenAdvance = () => {

        setSelectedAdvance(
            null
        );

        setOpen(true);
    };


    // ==========================================================
    // OPEN DAILY ADVANCE
    // ==========================================================

    const handleOpenDailyAdvance = () => {

        setDailyAdvanceOpen(
            true
        );
    };


    // ==========================================================
    // RENDER
    // ==========================================================

    return (
        <>

            {/* ==================================================
                PAGE HEADER
            ================================================== */}

            <PageHeader
                title="Employee Advances"
                subtitle="Manage employee salary advances"
                buttonText="Add Advance"
                onClick={
                    handleOpenAdvance
                }
            />


            {/* ==================================================
                DAILY ADVANCE BUTTON
            ================================================== */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "16px",
                }}
            >

                <button
                    type="button"
                    onClick={
                        handleOpenDailyAdvance
                    }
                    style={{
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >

                    + Daily Advance

                </button>

            </div>


            {/* ==================================================
                SEARCH
            ================================================== */}

            <SearchBar
                value={search}
                onChange={(e) =>
                    setSearch(
                        e.target.value
                    )
                }
                placeholder="Search advances..."
            />


            {/* ==================================================
                MAIN ADVANCE TABLE
            ================================================== */}

            <AdvanceTable
                rows={
                    filteredAdvances
                }
                employees={
                    employees
                }
                loading={
                    loading ||
                    employeesLoading
                }
                onEdit={
                    handleEdit
                }
                onDelete={
                    handleDelete
                }
            />


            {/* ==================================================
                DAILY ADVANCE HISTORY
            ================================================== */}

            <DailyAdvanceTable
                rows={
                    transactions
                }
                employees={
                    employees
                }
                loading={
                    dailyAdvancesLoading ||
                    employeesLoading
                }
            />


            {/* ==================================================
                MAIN ADVANCE DIALOG
            ================================================== */}

            <AdvanceDialog
                open={open}
                handleClose={() => {

                    setOpen(false);

                    setSelectedAdvance(
                        null
                    );
                }}
                onSubmit={
                    handleSubmit
                }
                advance={
                    selectedAdvance
                }
            />


            {/* ==================================================
                DAILY ADVANCE DIALOG
            ================================================== */}

            <DailyAdvanceDialog
                open={
                    dailyAdvanceOpen
                }
                handleClose={() => {

                    setDailyAdvanceOpen(
                        false
                    );
                }}
                onSubmit={
                    handleDailyAdvanceSubmit
                }
            />

        </>
    );
}


export default AdvancePage;