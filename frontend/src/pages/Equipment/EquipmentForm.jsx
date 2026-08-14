import {
    useEffect,
    useState,
} from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";


function EquipmentForm({
    onSubmit,
    equipment,
}) {

    const [formData, setFormData] = useState({
        equipment_code: "",
        equipment_name: "",
        category: "",
        manufacturer: "",

        ownership_type: "Rented",

        purchase_date: "",
        purchase_cost: "",

        rental_rate: "",
        rental_rate_unit: "Hour",

        status: "Available",
    });

    const [errors, setErrors] = useState({});


    // ==========================================================
    // LOAD EQUIPMENT FOR EDIT
    // ==========================================================

    useEffect(() => {

        if (equipment) {

            setFormData({
                equipment_code:
                    equipment.equipment_code || "",

                equipment_name:
                    equipment.equipment_name || "",

                category:
                    equipment.category || "",

                manufacturer:
                    equipment.manufacturer || "",

                ownership_type:
                    equipment.ownership_type || "Rented",

                purchase_date:
                    equipment.purchase_date || "",

                purchase_cost:
                    equipment.purchase_cost ?? "",

                rental_rate:
                    equipment.rental_rate ?? "",

                rental_rate_unit:
                    equipment.rental_rate_unit || "Hour",

                status:
                    equipment.status || "Available",
            });

        } else {

            setFormData({
                equipment_code: "",
                equipment_name: "",
                category: "",
                manufacturer: "",

                ownership_type: "Rented",

                purchase_date: "",
                purchase_cost: "",

                rental_rate: "",
                rental_rate_unit: "Hour",

                status: "Available",
            });
        }

        setErrors({});

    }, [equipment]);


    // ==========================================================
    // HANDLE CHANGE
    // ==========================================================

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setErrors({
            ...errors,
            [name]: "",
        });
    };


    // ==========================================================
    // SUBMIT
    // ==========================================================

    const handleSubmit = (e) => {

        e.preventDefault();

        const newErrors = {};


        // Equipment Code

        if (!formData.equipment_code.trim()) {

            newErrors.equipment_code =
                "Equipment Code is required";
        }


        // Equipment Name

        if (!formData.equipment_name.trim()) {

            newErrors.equipment_name =
                "Equipment Name is required";
        }


        // Category

        if (!formData.category) {

            newErrors.category =
                "Category is required";
        }


        // Owned validation

        if (
            formData.ownership_type === "Owned"
        ) {

            if (
                formData.purchase_cost !== "" &&
                Number(formData.purchase_cost) < 0
            ) {

                newErrors.purchase_cost =
                    "Purchase cost cannot be negative";
            }
        }


        // Rented validation

        if (
            formData.ownership_type === "Rented"
        ) {

            if (
                !formData.rental_rate ||
                Number(formData.rental_rate) <= 0
            ) {

                newErrors.rental_rate =
                    "Rental rate must be greater than 0";
            }

            if (!formData.rental_rate_unit) {

                newErrors.rental_rate_unit =
                    "Rental unit is required";
            }
        }


        setErrors(newErrors);


        if (
            Object.keys(newErrors).length > 0
        ) {
            return;
        }


        // ======================================================
        // PREPARE DATA
        // ======================================================

        const submitData = {

            equipment_code:
                formData.equipment_code,

            equipment_name:
                formData.equipment_name,

            category:
                formData.category,

            manufacturer:
                formData.manufacturer || null,

            ownership_type:
                formData.ownership_type,

            purchase_date:
                formData.ownership_type === "Owned"
                    ? (
                        formData.purchase_date || null
                    )
                    : null,

            purchase_cost:
                formData.ownership_type === "Owned"
                    ? (
                        formData.purchase_cost === ""
                            ? null
                            : Number(
                                formData.purchase_cost
                            )
                    )
                    : null,

            rental_rate:
                formData.ownership_type === "Rented"
                    ? Number(
                        formData.rental_rate
                    )
                    : null,

            rental_rate_unit:
                formData.ownership_type === "Rented"
                    ? formData.rental_rate_unit
                    : null,

            status:
                formData.status,
        };


        console.log(
            "EQUIPMENT SUBMIT:",
            submitData
        );

        onSubmit(submitData);
    };


    return (

        <form onSubmit={handleSubmit}>

            <Grid
                container
                spacing={2}
                mt={1}
            >

                {/* ==================================================
                    EQUIPMENT CODE
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        required
                        label="Equipment Code"
                        name="equipment_code"
                        value={
                            formData.equipment_code
                        }
                        onChange={
                            handleChange
                        }
                        disabled={!!equipment}
                        error={
                            !!errors.equipment_code
                        }
                        helperText={
                            errors.equipment_code
                        }
                    />

                </Grid>


                {/* ==================================================
                    EQUIPMENT NAME
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        required
                        label="Equipment Name"
                        name="equipment_name"
                        value={
                            formData.equipment_name
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.equipment_name
                        }
                        helperText={
                            errors.equipment_name
                        }
                    />

                </Grid>


                {/* ==================================================
                    CATEGORY
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        select
                        fullWidth
                        required
                        label="Category"
                        name="category"
                        value={
                            formData.category
                        }
                        onChange={
                            handleChange
                        }
                        error={
                            !!errors.category
                        }
                        helperText={
                            errors.category
                        }
                    >

                        <MenuItem value="">
                            Select Category
                        </MenuItem>

                        <MenuItem value="Excavator">
                            Excavator
                        </MenuItem>

                        <MenuItem value="Crane">
                            Crane
                        </MenuItem>

                        <MenuItem value="Loader">
                            Loader
                        </MenuItem>

                        <MenuItem value="Bulldozer">
                            Bulldozer
                        </MenuItem>

                        <MenuItem value="Concrete Mixer">
                            Concrete Mixer
                        </MenuItem>

                        <MenuItem value="Truck">
                            Truck
                        </MenuItem>

                        <MenuItem value="Generator">
                            Generator
                        </MenuItem>

                        <MenuItem value="Compactor">
                            Compactor
                        </MenuItem>

                        <MenuItem value="Other">
                            Other
                        </MenuItem>

                    </TextField>

                </Grid>


                {/* ==================================================
                    MANUFACTURER
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        fullWidth
                        label="Manufacturer"
                        name="manufacturer"
                        value={
                            formData.manufacturer
                        }
                        onChange={
                            handleChange
                        }
                    />

                </Grid>


                {/* ==================================================
                    OWNERSHIP TYPE
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        select
                        fullWidth
                        required
                        label="Ownership Type"
                        name="ownership_type"
                        value={
                            formData.ownership_type
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <MenuItem value="Rented">
                            Rented
                        </MenuItem>

                        <MenuItem value="Owned">
                            Owned
                        </MenuItem>

                    </TextField>

                </Grid>


                {/* ==================================================
                    OWNED → PURCHASE DATE
                ================================================== */}

                {formData.ownership_type === "Owned" && (

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            type="date"
                            label="Purchase Date"
                            name="purchase_date"
                            value={
                                formData.purchase_date
                            }
                            onChange={
                                handleChange
                            }
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                    </Grid>

                )}


                {/* ==================================================
                    OWNED → PURCHASE COST
                ================================================== */}

                {formData.ownership_type === "Owned" && (

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            type="number"
                            label="Purchase Cost"
                            name="purchase_cost"
                            value={
                                formData.purchase_cost
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.purchase_cost
                            }
                            helperText={
                                errors.purchase_cost
                            }
                            inputProps={{
                                min: 0,
                            }}
                        />

                    </Grid>

                )}


                {/* ==================================================
                    RENTED → RENTAL RATE
                ================================================== */}

                {formData.ownership_type === "Rented" && (

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            fullWidth
                            required
                            type="number"
                            label="Rental Rate"
                            name="rental_rate"
                            value={
                                formData.rental_rate
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.rental_rate
                            }
                            helperText={
                                errors.rental_rate ||
                                "Example: ₹2,500 per hour"
                            }
                            inputProps={{
                                min: 0,
                            }}
                        />

                    </Grid>

                )}


                {/* ==================================================
                    RENTED → RATE UNIT
                ================================================== */}

                {formData.ownership_type === "Rented" && (

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}
                    >

                        <TextField
                            select
                            fullWidth
                            required
                            label="Rental Rate Unit"
                            name="rental_rate_unit"
                            value={
                                formData.rental_rate_unit
                            }
                            onChange={
                                handleChange
                            }
                            error={
                                !!errors.rental_rate_unit
                            }
                            helperText={
                                errors.rental_rate_unit
                            }
                        >

                            <MenuItem value="Hour">
                                Per Hour
                            </MenuItem>

                            <MenuItem value="Day">
                                Per Day
                            </MenuItem>

                        </TextField>

                    </Grid>

                )}


                {/* ==================================================
                    STATUS
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >

                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="status"
                        value={
                            formData.status
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <MenuItem value="Available">
                            Available
                        </MenuItem>

                        <MenuItem value="In Use">
                            In Use
                        </MenuItem>

                        <MenuItem value="Maintenance">
                            Maintenance
                        </MenuItem>

                    </TextField>

                </Grid>


                {/* ==================================================
                    SAVE
                ================================================== */}

                <Grid
                    size={{
                        xs: 12,
                    }}
                >

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                    >

                        {equipment
                            ? "Update Equipment"
                            : "Save Equipment"}

                    </Button>

                </Grid>

            </Grid>

        </form>

    );
}


export default EquipmentForm;