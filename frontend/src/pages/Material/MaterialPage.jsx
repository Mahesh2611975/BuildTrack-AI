import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import MaterialTable from "./MaterialTable";
import MaterialDialog from "./MaterialDialog";

import useMaterials from "../../hooks/useMaterials";

import {
    createMaterial,
    updateMaterial,
} from "../../services/materialService";

function MaterialPage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [selectedMaterial, setSelectedMaterial] =
        useState(null);

    const {
        materials,
        loading,
        refreshMaterials,
    } = useMaterials();

    const handleSubmit = async (data) => {
        try {
            if (selectedMaterial) {
                await updateMaterial(
                    selectedMaterial.id,
                    data
                );

                alert("Material Updated Successfully");
            } else {
                await createMaterial(data);

                alert("Material Added Successfully");
            }

            setOpen(false);
            setSelectedMaterial(null);

            refreshMaterials();
        } catch (error) {
            console.error(error);
            alert("Operation Failed");
        }
    };

    const handleEdit = (material) => {
        setSelectedMaterial(material);
        setOpen(true);
    };

    const handleDelete = (material) => {
        console.log(material);
    };

    return (
        <>
            <PageHeader
                title="Materials"
                subtitle="Manage construction materials"
                buttonText="Add Material"
                onClick={() => {
                    setSelectedMaterial(null);
                    setOpen(true);
                }}
            />

            <SearchBar
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Search materials..."
            />

            <MaterialTable
                rows={materials}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <MaterialDialog
                open={open}
                handleClose={() => {
                    setOpen(false);
                    setSelectedMaterial(null);
                }}
                onSubmit={handleSubmit}
                material={selectedMaterial}
            />
        </>
    );
}

export default MaterialPage;