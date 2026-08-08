import { useState } from "react";

import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";

import ContractorTable from "./ContractorTable";
import ContractorDialog from "./ContractorDialog";

import useContractors from "../../hooks/useContractors";

import {
    createContractor,
    updateContractor,
    deleteContractor,
} from "../../services/contractorService";

import ConfirmDeleteDialog from "../../components/common/ConfirmDeleteDialog";

function ContractorPage() {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [selectedContractor, setSelectedContractor] =
        useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);

    const {
        contractors,
        loading,
        refreshContractors,
    } = useContractors();

    // ================================
    // SEARCH
    // ================================

    const filteredContractors = contractors.filter(
        (contractor) => {
            const searchValue =
                search.toLowerCase().trim();

            if (!searchValue) {
                return true;
            }

            return (
                contractor.contractor_id
                    ?.toLowerCase()
                    .includes(searchValue) ||

                contractor.company_name
                    ?.toLowerCase()
                    .includes(searchValue) ||

                contractor.contractor_name
                    ?.toLowerCase()
                    .includes(searchValue) ||

                contractor.mobile_number
                    ?.toLowerCase()
                    .includes(searchValue) ||

                contractor.email
                    ?.toLowerCase()
                    .includes(searchValue)
            );
        }
    );

    // ================================
    // ADD / UPDATE
    // ================================

    const handleSubmit = async (data) => {
        try {
            if (selectedContractor) {
                await updateContractor(
                    selectedContractor.id,
                    data
                );

                alert(
                    "Contractor Updated Successfully"
                );
            } else {
                await createContractor(data);

                alert(
                    "Contractor Added Successfully"
                );
            }

            setOpen(false);
            setSelectedContractor(null);

            await refreshContractors();

        } catch (error) {
            console.error(
                "CONTRACTOR OPERATION ERROR:",
                error
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Operation Failed"
            );
        }
    };

    // ================================
    // EDIT
    // ================================

    const handleEdit = (contractor) => {
        setSelectedContractor(contractor);
        setOpen(true);
    };

    // ================================
    // DELETE
    // ================================

    const handleDelete = (contractor) => {
        setSelectedContractor(contractor);
        setDeleteOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedContractor) {
            return;
        }

        try {
            await deleteContractor(
                selectedContractor.id
            );

            alert(
                "Contractor Deleted Successfully"
            );

            setDeleteOpen(false);
            setSelectedContractor(null);

            await refreshContractors();

        } catch (error) {
            console.error(
                "DELETE CONTRACTOR ERROR:",
                error
            );

            console.error(
                "RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete contractor"
            );
        }
    };

    return (
        <>
            <PageHeader
                title="Contractors"
                subtitle="Manage construction contractors"
                buttonText="Add Contractor"
                onClick={() => {
                    setSelectedContractor(null);
                    setOpen(true);
                }}
            />

            <SearchBar
                value={search}
                onChange={(e) =>
                    setSearch(e.target.value)
                }
                placeholder="Search contractors..."
            />

            <ContractorTable
                rows={filteredContractors}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <ContractorDialog
                open={open}
                handleClose={() => {
                    setOpen(false);
                    setSelectedContractor(null);
                }}
                onSubmit={handleSubmit}
                contractor={selectedContractor}
            />

            <ConfirmDeleteDialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedContractor(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Contractor"
                message={
                    selectedContractor
                        ? `Are you sure you want to delete "${selectedContractor.company_name}"?`
                        : "Are you sure you want to delete this contractor?"
                }
            />
        </>
    );
}

export default ContractorPage;