import { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

const initialFormData = {
    company_name: "",
    contractor_name: "",
    mobile_number: "",
    email: "",
    address: "",
    licence_number: "",
    gst_number: "",
    experience_years: "",
    is_active: true,
};

function ContractorForm({
    onSubmit,
    contractor,
}) {
    const [formData, setFormData] =
        useState(initialFormData);

    const [errors, setErrors] = useState({});

    // ==========================================
    // LOAD CONTRACTOR FOR EDIT
    // ==========================================

    useEffect(() => {
        if (contractor) {
            setFormData({
                company_name:
                    contractor.company_name || "",

                contractor_name:
                    contractor.contractor_name || "",

                mobile_number:
                    contractor.mobile_number || "",

                email:
                    contractor.email || "",

                address:
                    contractor.address || "",

                licence_number:
                    contractor.licence_number || "",

                gst_number:
                    contractor.gst_number || "",

                experience_years:
                    contractor.experience_years ?? "",

                is_active:
                    contractor.is_active ?? true,
            });

            setErrors({});
        } else {
            setFormData(initialFormData);
            setErrors({});
        }
    }, [contractor]);

    // ==========================================
    // HANDLE CHANGE
    // ==========================================

    const handleChange = (e) => {
        const {
            name,
            value,
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]:
                name === "is_active"
                    ? value === "true"
                    : value,
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: "",
        }));
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validate = () => {
        const newErrors = {};

        // Company
        if (!formData.company_name.trim()) {
            newErrors.company_name =
                "Company Name is required";
        }

        // Contractor Name
        if (!formData.contractor_name.trim()) {
            newErrors.contractor_name =
                "Contractor Name is required";
        }

        // Mobile
        if (!formData.mobile_number.trim()) {
            newErrors.mobile_number =
                "Mobile Number is required";
        } else if (
            !/^[0-9]{10,15}$/.test(
                formData.mobile_number
            )
        ) {
            newErrors.mobile_number =
                "Enter a valid mobile number";
        }

        // Email
        if (formData.email.trim()) {
            const emailRegex =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (
                !emailRegex.test(
                    formData.email
                )
            ) {
                newErrors.email =
                    "Enter a valid email address";
            }
        }

        // Experience
        if (
            formData.experience_years === "" ||
            Number(formData.experience_years) < 0
        ) {
            newErrors.experience_years =
                "Experience cannot be negative";
        }

        // GST
        if (formData.gst_number.trim()) {
            const gstRegex =
                /^[0-9A-Z]{15}$/;

            if (
                !gstRegex.test(
                    formData.gst_number
                        .trim()
                        .toUpperCase()
                )
            ) {
                newErrors.gst_number =
                    "GST number must contain 15 characters";
            }
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors).length === 0
        );
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            company_name:
                formData.company_name.trim(),

            contractor_name:
                formData.contractor_name.trim(),

            mobile_number:
                formData.mobile_number.trim(),

            email:
                formData.email.trim() || null,

            address:
                formData.address.trim() || null,

            licence_number:
                formData.licence_number.trim() ||
                null,

            gst_number:
                formData.gst_number
                    .trim()
                    .toUpperCase() || null,

            experience_years:
                Number(formData.experience_years),

            ...(contractor
                ? {
                      is_active:
                          formData.is_active,
                  }
                : {}),
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid
                container
                spacing={2}
                mt={1}
            >

                {/* Company Name */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
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
                </Grid>

                {/* Contractor Name */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        label="Contractor Name"
                        name="contractor_name"
                        value={
                            formData.contractor_name
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.contractor_name
                            )
                        }
                        helperText={
                            errors.contractor_name
                        }
                    />
                </Grid>

                {/* Mobile */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        required
                        label="Mobile Number"
                        name="mobile_number"
                        value={
                            formData.mobile_number
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.mobile_number
                            )
                        }
                        helperText={
                            errors.mobile_number
                        }
                        inputProps={{
                            maxLength: 15,
                        }}
                    />
                </Grid>

                {/* Email */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
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
                            errors.email
                        }
                    />
                </Grid>

                {/* Address */}
                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Address"
                        name="address"
                        value={
                            formData.address
                        }
                        onChange={handleChange}
                    />
                </Grid>

                {/* Licence Number */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Licence Number"
                        name="licence_number"
                        value={
                            formData.licence_number
                        }
                        onChange={handleChange}
                    />
                </Grid>

                {/* GST Number */}
                <Grid
                    size={{
                        xs: 12,
                        md: 6,
                    }}
                >
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
                            errors.gst_number
                        }
                        inputProps={{
                            maxLength: 15,
                        }}
                    />
                </Grid>

                {/* Experience */}
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
                        label="Experience (Years)"
                        name="experience_years"
                        value={
                            formData.experience_years
                        }
                        onChange={handleChange}
                        error={
                            Boolean(
                                errors.experience_years
                            )
                        }
                        helperText={
                            errors.experience_years
                        }
                        inputProps={{
                            min: 0,
                        }}
                    />
                </Grid>

                {/* Status */}
                {contractor && (
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
                            name="is_active"
                            value={
                                String(
                                    formData.is_active
                                )
                            }
                            onChange={handleChange}
                        >
                            <MenuItem value="true">
                                Active
                            </MenuItem>

                            <MenuItem value="false">
                                Inactive
                            </MenuItem>
                        </TextField>
                    </Grid>
                )}

                {/* Save Button */}
                <Grid size={{ xs: 12 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                    >
                        Save Contractor
                    </Button>
                </Grid>

            </Grid>
        </form>
    );
}

export default ContractorForm;