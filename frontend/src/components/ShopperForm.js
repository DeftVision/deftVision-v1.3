/*
// /components/ShopperForm.js
import {Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography,} from "@mui/material";
import {useEffect, useState} from "react";
import FileUploader from "../utilities/FileUploader";
import {useNotification} from "../utilities/NotificationContext";
import userLocations from "../utilities/UserLocations";

export default function ShopperForm({onShopperUpdated, editData}) {
    const {showNotification} = useNotification();

    // ✅ Define initial state with all necessary fields
    const initialFormData = {
        dateTime: new Date().toISOString().slice(0, 16),
        shopperName: "",
        location: "",
        greeting: false,
        cashier: "",
        orderRepeated: false,
        upsell: false,
        wait: "",
        foodScore: "",
        serviceScore: "",
        cleanScore: "",
        finalScore: "0.00",
        comments: "",
        imageUrl: null,
    };

    const [formData, setFormData] = useState(initialFormData);
    const [activeStep, setActiveStep] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [fileKey, setFileKey] = useState(null);

    // ✅ Handle form data changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // ✅ Auto-calculate Final Score when scores change
    useEffect(() => {
        const {foodScore, serviceScore, cleanScore} = formData;
        if (foodScore && serviceScore && cleanScore) {
            const averageScore = ((parseFloat(foodScore) + parseFloat(serviceScore) + parseFloat(cleanScore)) / 3).toFixed(2);
            setFormData((prev) => ({...prev, finalScore: averageScore}));
        }
    }, [formData.foodScore, formData.serviceScore, formData.cleanScore]);

    // ✅ Load data when editing an existing record
    useEffect(() => {
        if (editData) {
            setFormData({
                dateTime: editData.dateTime || initialFormData.dateTime,
                shopperName: editData.shopperName || "",
                location: editData.location || "",
                greeting: editData.greeting || false,
                cashier: editData.cashier || "",
                orderRepeated: editData.orderRepeated || false,
                upsell: editData.upsell || false,
                wait: editData.wait || "",
                foodScore: editData.foodScore || "",
                serviceScore: editData.serviceScore || "",
                cleanScore: editData.cleanScore || "",
                finalScore: editData.finalScore || "0.00",
                comments: editData.comments || "",
                imageUrl: editData.imageUrl || null,
            });
            setFileKey(editData.imageUniqueName || null);
        }
    }, [editData]);


    // ✅ Handle file upload
    const handleFileUpload = (newFileKey) => {
        setFileKey(newFileKey);
        setFormData((prev) => ({
            ...prev,
            imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileKey}`
        }));
    };

    // ✅ Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setUploading(true);

        const requestData = {
            ...formData,
            fileKey,
            uploadedBy: sessionStorage.getItem("userEmail") || "Unknown User",
        };

        try {
            const method = editData ? "PATCH" : "POST";
            const url = editData
                ? `${process.env.REACT_APP_API_URL}/shopper/${editData._id}`
                : `${process.env.REACT_APP_API_URL}/shopper/`;

            const response = await fetch(url, {
                method,
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to save shopper visit");
            }

            showNotification("✅ Shopper visit saved successfully", "success");
            setFormData(initialFormData);
            setFileKey(null);
            setUploading(false);

            if (onShopperUpdated) {
                onShopperUpdated();
            }
        } catch (error) {
            showNotification(`Failed to save shopper visit: ${error.message}`, "error");
            setUploading(false);
        }
    };

    return (
        <Box sx={{px: 2}}>

            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>

                    <TextField label="Shopper Name" name="shopperName" value={formData.shopperName}
                               onChange={handleChange} fullWidth required/>
                    <FormControl fullWidth required>
                        <InputLabel>Location</InputLabel>
                        <Select variant="outlined" label="Location" name="location" value={formData.location}
                                onChange={handleChange}>
                            {userLocations.map((location) => (
                                <MenuItem key={location} value={location}>
                                    {location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField label="Cashier Name" name="cashier" value={formData.cashier} onChange={handleChange}
                               fullWidth required/>

                    <TextField label="Food Score" name="foodScore" type="number" value={formData.foodScore}
                               onChange={handleChange} fullWidth required/>
                    <TextField label="Service Score" name="serviceScore" type="number" value={formData.serviceScore}
                               onChange={handleChange} fullWidth required/>
                    <TextField label="Cleanliness Score" name="cleanScore" type="number" value={formData.cleanScore}
                               onChange={handleChange} fullWidth required/>
                    <TextField label="Final Score (Auto-Calculated)" name="finalScore" type="number"
                               value={formData.finalScore} fullWidth disabled/>
                    <TextField label="Comments" name="comments" multiline rows={3} value={formData.comments}
                               onChange={handleChange} fullWidth/>
                    <Typography variant="body1">Upload Photo:</Typography>
                    <FileUploader onFileSelect={handleFileUpload}/>

                </Stack>

                <Stack direction="row" spacing={2} sx={{mt: 4}}>


                    <Button type="submit" variant="contained">Submit</Button>


                </Stack>
            </form>
        </Box>
    );
}
*/
