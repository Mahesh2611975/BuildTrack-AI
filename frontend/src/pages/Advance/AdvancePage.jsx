import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import AdvanceTable from "./AdvanceTable";
import AdvanceDialog from "./AdvanceDialog";
import useEmployees from "../../hooks/useEmployees";
import useAdvances from "../../hooks/useAdvances";

import {
    createAdvance,
    updateAdvance,
    deleteAdvance,
} from "../../services/advanceService";


function AdvancePage() {

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [
        selectedAdvance,
        setSelectedAdvance,
    ] = useState(null);


    const {
        advances,
        loading,
        refreshAdvances,
    } = useAdvances();
    
    const {
        employees,
        loading: employeesLoading,
    } = useEmployees();

    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredAdvances =
        advances.filter((advance) => {

            const searchText =
                search.toLowerCase();

            return (
                advance.advance_code
                    ?.toLowerCase()
                    .includes(searchText) ||

                String(
                    advance.employee_id
                )
                    .includes(searchText) ||

                advance.reason
                    ?.toLowerCase()
                    .includes(searchText) ||

                advance.status
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });


    // ==========================================================
    // CREATE / UPDATE
    // ==========================================================

    const handleSubmit = async (data) => {

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

                await createAdvance(data);

                alert(
                    "Advance Added Successfully"
                );
            }


            setOpen(false);

            setSelectedAdvance(null);

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
    // EDIT
    // ==========================================================

    const handleEdit = (advance) => {

        setSelectedAdvance(
            advance
        );

        setOpen(true);
    };


    // ==========================================================
    // DELETE
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


    return (
        <>

            <PageHeader
                title="Employee Advances"
                subtitle="Manage employee salary advances"
                buttonText="Add Advance"
                onClick={() => {

                    setSelectedAdvance(
                        null
                    );

                    setOpen(true);
                }}
            />


            <SearchBar
                value={search}
                onChange={(e) =>
                    setSearch(
                        e.target.value
                    )
                }
                placeholder="Search advances..."
            />


            <AdvanceTable
                rows={filteredAdvances}
                employees={employees}
                loading={
                    loading ||
                    employeesLoading
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
            />


            <AdvanceDialog
                open={open}
                handleClose={() => {

                    setOpen(false);

                    setSelectedAdvance(
                        null
                    );
                }}
                onSubmit={handleSubmit}
                advance={
                    selectedAdvance
                }
            />

        </>
    );
}


export default AdvancePage;