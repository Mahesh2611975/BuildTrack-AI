import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import {
    getSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "../../services/supplierService";


const EMPTY_FORM = {
    supplier_code: "",
    company_name: "",
    contact_person: "",
    mobile_number: "",
    email: "",
    address: "",
    gst_number: "",
    is_active: true,
};


function SupplierPage() {

    const [suppliers, setSuppliers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [open, setOpen] =
        useState(false);

    const [selectedSupplier, setSelectedSupplier] =
        useState(null);

    const [deleteOpen, setDeleteOpen] =
        useState(false);

    const [formData, setFormData] =
        useState(EMPTY_FORM);

    const [errors, setErrors] =
        useState({});


    // =====================================================
    // LOAD SUPPLIERS
    // =====================================================

    const loadSuppliers = async () => {

        try {

            setLoading(true);

            const response =
                await getSuppliers();

            setSuppliers(
                response.data || []
            );

        } catch (error) {

            console.error(
                "Failed to load suppliers:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to load suppliers"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadSuppliers();
    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredSuppliers = useMemo(() => {

        const value =
            search.trim().toLowerCase();

        if (!value) {
            return suppliers;
        }

        return suppliers.filter(
            (supplier) =>
                supplier.supplier_code
                    ?.toLowerCase()
                    .includes(value) ||

                supplier.company_name
                    ?.toLowerCase()
                    .includes(value) ||

                supplier.contact_person
                    ?.toLowerCase()
                    .includes(value) ||

                supplier.mobile_number
                    ?.toLowerCase()
                    .includes(value) ||

                supplier.email
                    ?.toLowerCase()
                    .includes(value) ||

                supplier.gst_number
                    ?.toLowerCase()
                    .includes(value)
        );

    }, [suppliers, search]);


    // =====================================================
    // OPEN ADD
    // =====================================================

    const handleAdd = () => {

        setSelectedSupplier(null);

        setFormData({
            ...EMPTY_FORM,
        });

        setErrors({});

        setOpen(true);
    };


    // =====================================================
    // OPEN EDIT
    // =====================================================

    const handleEdit = (supplier) => {

        setSelectedSupplier(supplier);

        setFormData({
            supplier_code:
                supplier.supplier_code || "",

            company_name:
                supplier.company_name || "",

            contact_person:
                supplier.contact_person || "",

            mobile_number:
                supplier.mobile_number || "",

            email:
                supplier.email || "",

            address:
                supplier.address || "",

            gst_number:
                supplier.gst_number || "",

            is_active:
                supplier.is_active ?? true,
        });

        setErrors({});

        setOpen(true);
    };


    // =====================================================
    // CLOSE FORM
    // =====================================================

    const handleClose = () => {

        setOpen(false);

        setSelectedSupplier(null);

        setFormData({
            ...EMPTY_FORM,
        });

        setErrors({});
    };


    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

        setErrors(
            (previous) => ({
                ...previous,
                [name]: "",
            })
        );
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const newErrors = {};


        if (!selectedSupplier) {

            if (!formData.supplier_code.trim()) {

                newErrors.supplier_code =
                    "Supplier code is required";

            } else if (
                formData.supplier_code.trim().length > 20
            ) {

                newErrors.supplier_code =
                    "Maximum 20 characters";
            }
        }


        if (!formData.company_name.trim()) {

            newErrors.company_name =
                "Company name is required";

        } else if (
            formData.company_name.trim().length > 100
        ) {

            newErrors.company_name =
                "Maximum 100 characters";
        }


        if (!formData.contact_person.trim()) {

            newErrors.contact_person =
                "Contact person is required";

        } else if (
            formData.contact_person.trim().length > 100
        ) {

            newErrors.contact_person =
                "Maximum 100 characters";
        }


        if (!formData.mobile_number.trim()) {

            newErrors.mobile_number =
                "Mobile number is required";

        } else if (
            !/^[6-9]\d{9}$/.test(
                formData.mobile_number.trim()
            )
        ) {

            newErrors.mobile_number =
                "Enter a valid 10-digit mobile number";
        }


        if (formData.email.trim()) {

            if (
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    formData.email.trim()
                )
            ) {

                newErrors.email =
                    "Enter a valid email address";
            }
        }


        if (
            formData.gst_number.trim() &&
            formData.gst_number.trim().length > 50
        ) {

            newErrors.gst_number =
                "Maximum 50 characters";
        }


        if (
            formData.address.trim().length > 255
        ) {

            newErrors.address =
                "Maximum 255 characters";
        }


        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };


    // =====================================================
    // SAVE
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validate()) {
            return;
        }


        try {

            if (selectedSupplier) {

                const data = {
                    company_name:
                        formData.company_name.trim(),

                    contact_person:
                        formData.contact_person.trim(),

                    mobile_number:
                        formData.mobile_number.trim(),

                    email:
                        formData.email.trim() ||
                        null,

                    address:
                        formData.address.trim() ||
                        null,

                    gst_number:
                        formData.gst_number.trim() ||
                        null,

                    is_active:
                        Boolean(formData.is_active),
                };

                await updateSupplier(
                    selectedSupplier.id,
                    data
                );

                alert(
                    "Supplier Updated Successfully"
                );

            } else {

                const data = {
                    supplier_code:
                        formData.supplier_code.trim(),

                    company_name:
                        formData.company_name.trim(),

                    contact_person:
                        formData.contact_person.trim(),

                    mobile_number:
                        formData.mobile_number.trim(),

                    email:
                        formData.email.trim() ||
                        null,

                    address:
                        formData.address.trim() ||
                        null,

                    gst_number:
                        formData.gst_number.trim() ||
                        null,
                };

                await createSupplier(data);

                alert(
                    "Supplier Added Successfully"
                );
            }

            handleClose();

            await loadSuppliers();

        } catch (error) {

            console.error(
                "Supplier operation failed:",
                error
            );

            const detail =
                error.response?.data?.detail;

            let message =
                "Supplier operation failed";

            if (Array.isArray(detail)) {

                message =
                    detail
                        .map(
                            (item) =>
                                item.msg
                        )
                        .join("\n");

            } else if (detail) {

                message = detail;
            }

            alert(message);
        }
    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = (supplier) => {

        setSelectedSupplier(supplier);

        setDeleteOpen(true);
    };


    const confirmDelete = async () => {

        if (!selectedSupplier) {
            return;
        }

        try {

            await deleteSupplier(
                selectedSupplier.id
            );

            alert(
                "Supplier Deleted Successfully"
            );

            setDeleteOpen(false);

            setSelectedSupplier(null);

            await loadSuppliers();

        } catch (error) {

            console.error(
                "Delete supplier failed:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Failed to delete supplier"
            );
        }
    };


    // =====================================================
    // TABLE STYLES
    // =====================================================

    const thStyle = {
        textAlign: "left",
        padding: "15px 16px",
        borderBottom: "1px solid #eadfca",
        fontWeight: 700,
        color: "#2b1c19",
        whiteSpace: "nowrap",
    };


    const tdStyle = {
        padding: "15px 16px",
        borderBottom: "1px solid #eee5d5",
        verticalAlign: "middle",
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            sx={{
                p: 3,
                minHeight: "100%",
                background:
                    "linear-gradient(135deg, #fffaf0 0%, #f8efd9 100%)",
            }}
        >

            {/* HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                    mb: 3,
                    flexWrap: "wrap",
                }}
            >

                <Box>

                    <Typography
                        sx={{
                            fontFamily:
                                '"Playfair Display", Georgia, serif',
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "#241713",
                            mb: 0.5,
                        }}
                    >
                        Suppliers
                    </Typography>

                    <Typography
                        color="text.secondary"
                    >
                        Manage supplier companies and contacts
                    </Typography>

                </Box>


                <Box
                    sx={{
                        display: "flex",
                        gap: 1.2,
                    }}
                >

                    <Button
                        variant="outlined"
                        startIcon={
                            <RefreshIcon />
                        }
                        onClick={loadSuppliers}
                        disabled={loading}
                        sx={{
                            borderColor: "#dca62f",
                            color: "#8c6518",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2,
                            "&:hover": {
                                borderColor: "#b98518",
                                backgroundColor: "#fff8e8",
                            },
                        }}
                    >
                        Refresh
                    </Button>


                    <Button
                        variant="contained"
                        startIcon={
                            <AddIcon />
                        }
                        onClick={handleAdd}
                        sx={{
                            backgroundColor: "#e1a625",
                            color: "#241713",
                            fontWeight: 700,
                            borderRadius: 2,
                            px: 2.2,
                            boxShadow:
                                "0 3px 8px rgba(130, 91, 16, 0.18)",
                            "&:hover": {
                                backgroundColor: "#cf941b",
                            },
                        }}
                    >
                        Add Supplier
                    </Button>

                </Box>

            </Box>


            {/* SEARCH */}

            <TextField
                fullWidth
                placeholder="Search suppliers, companies, contacts..."
                value={search}
                onChange={(event) =>
                    setSearch(event.target.value)
                }
                InputProps={{
                    startAdornment: (
                        <SearchIcon
                            sx={{
                                mr: 1,
                                color: "text.secondary",
                            }}
                        />
                    ),
                }}
                sx={{
                    maxWidth: 520,
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                        borderRadius: 2.5,
                        backgroundColor: "#fffaf0",
                    },
                }}
            />


            {/* TABLE */}

            <Box
                sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: 4,
                    overflow: "auto",
                    border:
                        "1px solid #eadfca",
                    boxShadow:
                        "0 2px 5px rgba(70, 48, 30, 0.08)",
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: 0,
                        minWidth: 1050,
                    }}
                >

                    <thead>

                        <tr>

                            <th style={thStyle}>
                                Supplier
                            </th>

                            <th style={thStyle}>
                                Contact Person
                            </th>

                            <th style={thStyle}>
                                Mobile
                            </th>

                            <th style={thStyle}>
                                Email
                            </th>

                            <th style={thStyle}>
                                GST Number
                            </th>

                            <th style={thStyle}>
                                Status
                            </th>

                            <th
                                style={{
                                    ...thStyle,
                                    textAlign: "center",
                                }}
                            >
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {loading ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    style={{
                                        ...tdStyle,
                                        textAlign: "center",
                                        padding: "45px",
                                        color: "#8b786d",
                                    }}
                                >
                                    Loading suppliers...
                                </td>

                            </tr>

                        ) : filteredSuppliers.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={7}
                                    style={{
                                        ...tdStyle,
                                        textAlign: "center",
                                        padding: "50px",
                                        color: "#8b786d",
                                    }}
                                >
                                    No suppliers found
                                </td>

                            </tr>

                        ) : (

                            filteredSuppliers.map(
                                (supplier) => (

                                    <tr
                                        key={
                                            supplier.id
                                        }
                                    >

                                        <td style={tdStyle}>

                                            <Typography
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "#2b1c19",
                                                }}
                                            >
                                                {
                                                    supplier.company_name
                                                }
                                            </Typography>

                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: "#8b786d",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {
                                                    supplier.supplier_code
                                                }
                                            </Typography>

                                        </td>


                                        <td style={tdStyle}>

                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {
                                                    supplier.contact_person
                                                }
                                            </Typography>

                                        </td>


                                        <td style={tdStyle}>

                                            {
                                                supplier.mobile_number
                                            }

                                        </td>


                                        <td style={tdStyle}>

                                            {
                                                supplier.email ||
                                                "—"
                                            }

                                        </td>


                                        <td style={tdStyle}>

                                            {
                                                supplier.gst_number ||
                                                "—"
                                            }

                                        </td>


                                        <td style={tdStyle}>

                                            <Chip
                                                label={
                                                    supplier.is_active
                                                        ? "Active"
                                                        : "Inactive"
                                                }
                                                size="small"
                                                sx={{
                                                    fontWeight: 700,
                                                    backgroundColor:
                                                        supplier.is_active
                                                            ? "#2e7d32"
                                                            : "#eeeeee",
                                                    color:
                                                        supplier.is_active
                                                            ? "#ffffff"
                                                            : "#555555",
                                                }}
                                            />

                                        </td>


                                        <td
                                            style={{
                                                ...tdStyle,
                                                textAlign: "center",
                                            }}
                                        >

                                            <Button
                                                onClick={() =>
                                                    handleEdit(
                                                        supplier
                                                    )
                                                }
                                                sx={{
                                                    minWidth: 40,
                                                    color: "#d69b20",
                                                }}
                                            >
                                                <EditIcon />
                                            </Button>


                                            <Button
                                                onClick={() =>
                                                    handleDelete(
                                                        supplier
                                                    )
                                                }
                                                sx={{
                                                    minWidth: 40,
                                                    color: "#d32f2f",
                                                }}
                                            >
                                                <DeleteIcon />
                                            </Button>

                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </Box>


            {/* =====================================================
                ADD / EDIT DIALOG
            ===================================================== */}

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 4,
                        p: 1,
                    },
                }}
            >

                <DialogTitle
                    sx={{
                        fontFamily:
                            '"Playfair Display", Georgia, serif',
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#2b1c19",
                    }}
                >
                    {selectedSupplier
                        ? "Edit Supplier"
                        : "Add Supplier"}
                </DialogTitle>


                <DialogContent>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, minmax(0, 1fr))",
                                gap: 2,
                                mt: 1,

                                "@media (max-width: 700px)": {
                                    gridTemplateColumns:
                                        "1fr",
                                },
                            }}
                        >

                            {/* Supplier Code */}

                            {!selectedSupplier && (

                                <TextField
                                    fullWidth
                                    required
                                    label="Supplier Code"
                                    name="supplier_code"
                                    placeholder="SUP001"
                                    value={
                                        formData.supplier_code
                                    }
                                    onChange={handleChange}
                                    error={
                                        Boolean(
                                            errors.supplier_code
                                        )
                                    }
                                    helperText={
                                        errors.supplier_code ||
                                        "Unique supplier code"
                                    }
                                />

                            )}


                            <TextField
                                fullWidth
                                required
                                label="Company Name"
                                name="company_name"
                                value={
                                    formData.company_name
                                }
                                onChange={handleChange}
                                error={
                                    Boolean(
                                        errors.company_name
                                    )
                                }
                                helperText={
                                    errors.company_name
                                }
                            />


                            <TextField
                                fullWidth
                                required
                                label="Contact Person"
                                name="contact_person"
                                value={
                                    formData.contact_person
                                }
                                onChange={handleChange}
                                error={
                                    Boolean(
                                        errors.contact_person
                                    )
                                }
                                helperText={
                                    errors.contact_person
                                }
                            />


                            <TextField
                                fullWidth
                                required
                                label="Mobile Number"
                                name="mobile_number"
                                value={
                                    formData.mobile_number
                                }
                                onChange={handleChange}
                                inputProps={{
                                    maxLength: 10,
                                }}
                                error={
                                    Boolean(
                                        errors.mobile_number
                                    )
                                }
                                helperText={
                                    errors.mobile_number ||
                                    "Enter 10-digit mobile number"
                                }
                            />


                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={
                                    formData.email
                                }
                                onChange={handleChange}
                                error={
                                    Boolean(
                                        errors.email
                                    )
                                }
                                helperText={
                                    errors.email ||
                                    "Optional"
                                }
                            />


                            <TextField
                                fullWidth
                                label="GST Number"
                                name="gst_number"
                                value={
                                    formData.gst_number
                                }
                                onChange={handleChange}
                                error={
                                    Boolean(
                                        errors.gst_number
                                    )
                                }
                                helperText={
                                    errors.gst_number ||
                                    "Optional"
                                }
                            />


                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                multiline
                                minRows={3}
                                value={
                                    formData.address
                                }
                                onChange={handleChange}
                                error={
                                    Boolean(
                                        errors.address
                                    )
                                }
                                helperText={
                                    errors.address ||
                                    "Optional supplier address"
                                }
                                sx={{
                                    gridColumn:
                                        "1 / -1",
                                }}
                            />


                            {selectedSupplier && (

                                <TextField
                                    select
                                    fullWidth
                                    label="Status"
                                    name="is_active"
                                    value={
                                        String(
                                            formData.is_active
                                        )
                                    }
                                    onChange={(event) =>
                                        setFormData(
                                            (previous) => ({
                                                ...previous,
                                                is_active:
                                                    event.target.value ===
                                                    "true",
                                            })
                                        )
                                    }
                                >

                                    <MenuItem value="true">
                                        Active
                                    </MenuItem>

                                    <MenuItem value="false">
                                        Inactive
                                    </MenuItem>

                                </TextField>

                            )}

                            <Box
                                sx={{
                                    gridColumn:
                                        "1 / -1",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 1.5,
                                    mt: 1,
                                }}
                            >

                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
                                    sx={{
                                        borderColor: "#dca62f",
                                        color: "#8c6518",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 3,
                                    }}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        <LocalShippingIcon />
                                    }
                                    sx={{
                                        backgroundColor:
                                            "#e1a625",
                                        color: "#241713",
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        px: 3,
                                        "&:hover": {
                                            backgroundColor:
                                                "#cf941b",
                                        },
                                    }}
                                >
                                    {selectedSupplier
                                        ? "UPDATE SUPPLIER"
                                        : "SAVE SUPPLIER"}
                                </Button>

                            </Box>

                        </Box>

                    </form>

                </DialogContent>

            </Dialog>


            {/* =====================================================
                DELETE CONFIRMATION
            ===================================================== */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setSelectedSupplier(null);
                }}
                maxWidth="xs"
                fullWidth
            >

                <DialogTitle
                    sx={{
                        fontWeight: 700,
                    }}
                >
                    Delete Supplier
                </DialogTitle>


                <DialogContent>

                    <Typography
                        sx={{
                            mb: 3,
                            color: "#806f65",
                        }}
                    >
                        Are you sure you want to delete{" "}
                        <strong>
                            {
                                selectedSupplier
                                    ?.company_name
                            }
                        </strong>
                        ?
                    </Typography>


                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 1,
                        }}
                    >

                        <Button
                            onClick={() => {
                                setDeleteOpen(false);
                                setSelectedSupplier(null);
                            }}
                            sx={{
                                color: "#c58d18",
                                fontWeight: 700,
                            }}
                        >
                            Cancel
                        </Button>


                        <Button
                            variant="contained"
                            color="error"
                            onClick={confirmDelete}
                            sx={{
                                fontWeight: 700,
                                borderRadius: 2,
                            }}
                        >
                            Delete
                        </Button>

                    </Box>

                </DialogContent>

            </Dialog>

        </Box>
    );
}


export default SupplierPage;
