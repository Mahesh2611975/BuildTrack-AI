import { useState, useEffect } from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

function MaterialForm({
    onSubmit,
    material,
}) {

    const [formData, setFormData] = useState({
        material_name: "",
        category: "",
        unit: "",
        quantity: "",
        unit_price: "",
        supplier: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (material) {
            setFormData({
                material_name: material.material_name,
                category: material.category,
                unit: material.unit,
                quantity: material.quantity,
                unit_price: material.unit_price,
                supplier: material.supplier || "",
            });
        }
    }, [material]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {};

        if (!formData.material_name.trim()) {
            newErrors.material_name = "Material Name is required";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (!formData.unit) {
            newErrors.unit = "Unit is required";
        }

        if (
            !formData.quantity ||
            Number(formData.quantity) <= 0
        ) {
            newErrors.quantity =
                "Quantity must be greater than 0";
        }

        if (
            !formData.unit_price ||
            Number(formData.unit_price) <= 0
        ) {
            newErrors.unit_price =
                "Unit Price must be greater than 0";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} mt={1}>

                {/* Material Name */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        required
                        label="Material Name"
                        name="material_name"
                        value={formData.material_name}
                        onChange={handleChange}
                        error={!!errors.material_name}
                        helperText={errors.material_name}
                    />
                </Grid>

                {/* Category */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        required
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        error={!!errors.category}
                        helperText={errors.category}
                    >
                        <MenuItem value="">
                            Select Category
                        </MenuItem>

                        <MenuItem value="Construction">
                            Construction
                        </MenuItem>

                        <MenuItem value="Cement">
                            Cement
                        </MenuItem>

                        <MenuItem value="Steel">
                            Steel
                        </MenuItem>

                        <MenuItem value="Sand">
                            Sand
                        </MenuItem>

                        <MenuItem value="Bricks">
                            Bricks
                        </MenuItem>

                        <MenuItem value="Electrical">
                            Electrical
                        </MenuItem>

                        <MenuItem value="Plumbing">
                            Plumbing
                        </MenuItem>

                        <MenuItem value="Paint">
                            Paint
                        </MenuItem>

                        <MenuItem value="Hardware">
                            Hardware
                        </MenuItem>

                        <MenuItem value="Safety Equipment">
                            Safety Equipment
                        </MenuItem>

                        <MenuItem value="Finishing Material">
                            Finishing Material
                        </MenuItem>

                    </TextField>
                </Grid>

                {/* Unit */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        required
                        label="Unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        error={!!errors.unit}
                        helperText={errors.unit}
                    >
                        <MenuItem value="">
                            Select Unit
                        </MenuItem>

                        <MenuItem value="Bag">
                            Bag
                        </MenuItem>

                        <MenuItem value="Kg">
                            Kg
                        </MenuItem>

                        <MenuItem value="Ton">
                            Ton
                        </MenuItem>

                        <MenuItem value="Piece">
                            Piece
                        </MenuItem>

                        <MenuItem value="Box">
                            Box
                        </MenuItem>

                        <MenuItem value="Meter">
                            Meter
                        </MenuItem>

                        <MenuItem value="Liter">
                            Liter
                        </MenuItem>

                        <MenuItem value="Cubic Meter (m³)">
                            Cubic Meter (m³)
                        </MenuItem>

                    </TextField>
                </Grid>

                {/* Quantity */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                    />
                </Grid>

                {/* Unit Price */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        required
                        type="number"
                        label="Unit Price"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleChange}
                        error={!!errors.unit_price}
                        helperText={errors.unit_price}
                    />
                </Grid>

                {/* Supplier */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Supplier"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                    />
                </Grid>

                {/* Save Button */}
                <Grid size={{ xs: 12 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                    >
                        Save Material
                    </Button>
                </Grid>

            </Grid>
        </form>
    );
}

export default MaterialForm;