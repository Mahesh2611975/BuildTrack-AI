import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import EquipmentTable from "./EquipmentTable";
import EquipmentDialog from "./EquipmentDialog";

import useEquipment from "../../hooks/useEquipment";

import {
    createEquipment,
    updateEquipment,
    deleteEquipment,
} from "../../services/equipmentService";

function EquipmentPage() {

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [
        selectedEquipment,
        setSelectedEquipment,
    ] = useState(null);

    const {
        equipment,
        loading,
        refreshEquipment,
    } = useEquipment();

    // ==========================================================
    // FILTER
    // ==========================================================

    const filteredEquipment =
        equipment.filter((item) => {

            const searchText =
                search.toLowerCase();

            return (
                item.equipment_code
                    ?.toLowerCase()
                    .includes(searchText) ||

                item.equipment_name
                    ?.toLowerCase()
                    .includes(searchText) ||

                item.category
                    ?.toLowerCase()
                    .includes(searchText) ||

                item.manufacturer
                    ?.toLowerCase()
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

            if (selectedEquipment) {

                await updateEquipment(
                    selectedEquipment.id,
                    data
                );

                alert(
                    "Equipment Updated Successfully"
                );

            } else {

                await createEquipment(data);

                alert(
                    "Equipment Added Successfully"
                );
            }

            setOpen(false);

            setSelectedEquipment(null);

            await refreshEquipment();

        } catch (error) {

            console.error(
                "Equipment operation failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Equipment operation failed"
            );
        }
    };

    // ==========================================================
    // EDIT
    // ==========================================================

    const handleEdit = (equipment) => {

        setSelectedEquipment(
            equipment
        );

        setOpen(true);
    };

    // ==========================================================
    // DELETE
    // ==========================================================

    const handleDelete = async (
        equipment,
    ) => {

        const confirmDelete =
            window.confirm(
                `Delete ${equipment.equipment_name}?`
            );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteEquipment(
                equipment.id
            );

            await refreshEquipment();

            alert(
                "Equipment Deleted Successfully"
            );

        } catch (error) {

            console.error(
                "Delete equipment failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete equipment"
            );
        }
    };

    return (
        <>

            <PageHeader
                title="Equipment"
                subtitle="Manage construction equipment"
                buttonText="Add Equipment"
                onClick={() => {

                    setSelectedEquipment(
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
                placeholder="Search equipment..."
            />

            <EquipmentTable
                rows={filteredEquipment}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <EquipmentDialog
                open={open}
                handleClose={() => {

                    setOpen(false);

                    setSelectedEquipment(
                        null
                    );
                }}
                onSubmit={handleSubmit}
                equipment={
                    selectedEquipment
                }
            />

        </>
    );
}

export default EquipmentPage;