import { useState, useEffect } from "react";

import {
    Grid,
    TextField,
    Button,
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2} mt={1}>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Material Name"
                        name="material_name"
                        value={formData.material_name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        type="number"
                        label="Unit Price"
                        name="unit_price"
                        value={formData.unit_price}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        fullWidth
                        label="Supplier"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                    />
                </Grid>

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