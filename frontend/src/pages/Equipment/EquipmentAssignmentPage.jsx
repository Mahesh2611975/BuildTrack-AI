import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EquipmentAssignmentTable from "./EquipmentAssignmentTable";
import EquipmentAssignmentDialog from "./EquipmentAssignmentDialog";

import useEquipmentAssignments from "../../hooks/useEquipmentAssignments";

import {
    createEquipmentAssignment,
    updateEquipmentAssignment,
} from "../../services/equipmentAssignmentService";


function EquipmentAssignmentPage() {

    const [search, setSearch] = useState("");

    const [open, setOpen] = useState(false);

    const [
        selectedAssignment,
        setSelectedAssignment,
    ] = useState(null);


    const {
        assignments,
        loading,
        refreshAssignments,
    } = useEquipmentAssignments();


    // ==========================================================
    // SEARCH
    // ==========================================================

    const filteredAssignments =
        assignments.filter((item) => {

            const searchText =
                search.toLowerCase();

            return (
                String(
                    item.id
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    item.equipment_id
                )
                    .toLowerCase()
                    .includes(searchText) ||

                String(
                    item.project_id
                )
                    .toLowerCase()
                    .includes(searchText) ||

                item.status
                    ?.toLowerCase()
                    .includes(searchText)
            );
        });


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = async (data) => {

        try {

            if (selectedAssignment) {

                await updateEquipmentAssignment(
                    selectedAssignment.id,
                    data
                );

                alert(
                    "Equipment Assignment Updated Successfully"
                );

            } else {

                await createEquipmentAssignment(
                    data
                );

                alert(
                    "Equipment Assigned Successfully"
                );
            }


            setOpen(false);

            setSelectedAssignment(null);

            await refreshAssignments();

        } catch (error) {

            console.error(
                "Equipment assignment failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Equipment assignment failed"
            );
        }
    };


    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit = (assignment) => {

        setSelectedAssignment(
            assignment
        );

        setOpen(true);
    };


    return (
        <>

            <PageHeader
                title="Equipment Assignments"
                subtitle="Assign and manage construction equipment"
                buttonText="Assign Equipment"
                onClick={() => {

                    setSelectedAssignment(
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
                placeholder="Search assignments..."
            />


            <EquipmentAssignmentTable
                rows={filteredAssignments}
                loading={loading}
                onEdit={handleEdit}
            />


            <EquipmentAssignmentDialog
                open={open}
                handleClose={() => {

                    setOpen(false);

                    setSelectedAssignment(
                        null
                    );
                }}
                onSubmit={handleSubmit}
                assignment={
                    selectedAssignment
                }
            />

        </>
    );
}


export default EquipmentAssignmentPage;