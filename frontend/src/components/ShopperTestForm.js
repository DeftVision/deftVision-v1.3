// /components/ShopperForm.js
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import {useEffect, useState} from "react";
import {useNotification} from "../utilities/NotificationContext";
import {locations} from "../utilities";

export default function ShopperForm({onShopperUpdated, editData}) {
    const {showNotification} = useNotification();


    const token = sessionStorage.getItem("token");
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    const user = JSON.parse(decoded);

    const shopperNameFromToken =
        user ? `${user.firstName} ${user.lastName}` : "Unknown User";

    // Define initial state with all necessary fields
    const initialFormData = {
        dateTime: new Date().toISOString().slice(0, 16),
        shopperName: shopperNameFromToken,
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
    const [uploading, setUploading] = useState(false);
    const [fileKey, setFileKey] = useState(null);


    // Handle form data changes
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    // Auto-calculate Final Score when scores change
    useEffect(() => {
        const {foodScore, serviceScore, cleanScore} = formData;
        if (foodScore && serviceScore && cleanScore) {
            const averageScore = ((parseFloat(foodScore) + parseFloat(serviceScore) + parseFloat(cleanScore)) / 3).toFixed(2);
            setFormData((prev) => ({...prev, finalScore: averageScore}));
        }
    }, [formData.foodScore, formData.serviceScore, formData.cleanScore]);

    // Load data when editing an existing record
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


    // Handle file upload
    const handleFileUpload = (newFileKey) => {
        setFileKey(newFileKey);
        setFormData((prev) => ({
            ...prev,
            imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileKey}`
        }));
    };

    // Handle form submission
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

            showNotification("Shopper visit saved successfully", "success");
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
        <Box sx={{width: '100%', px: 2, mb: 4}}>

            <form onSubmit={handleSubmit}>

                {/*     LOGISTICS Group     */}
                <Box sx={{
                    mb: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography sx={{mb: 4, textAlign: 'center', justifyContent: 'center'}}>Logistics</Typography>
                    <Stack spacing={3} direction='row'>
                        <TextField
                            type='datetime-local'
                            label='Date & Time'
                            value={formData.dateTime}
                            onChange={(e) => setFormData({
                                ...formData,
                                dateTime: e.target.value,
                            })}
                            slotProps={{ inputLabel: {shrink: true } }}
                        />

                        {/*     Autofill shopper name from token [ field is hidden from UI ]  */}
                        <input
                            type='hidden'
                            value={formData.shopperName}
                            onChange={(e) => setFormData({
                                ...formData,
                                shopperName: e.target.value,
                            })}
                        />

                        <FormControl>
                            <InputLabel>Location</InputLabel>
                            <Select
                                variant="outlined"
                                placeholder="Location"
                                label="Location"
                                value={formData.location || ''}
                                onChange={(e) =>
                                    setFormData({...formData, location: e.target.value})
                                }
                                sx={{minWidth: 200}}
                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>


                {/*     INTERACTION GROUP      */}
                <Box sx={{
                    mb: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography
                        sx={{mb: 4, textAlign: 'center', justifyContent: 'center'}}>
                        Interaction
                    </Typography>

                    <Stack direction='row' spacing={2} sx={{ mb: 4, justifyContent: 'space-between' }}>
                        <Stack direction='column' spacing={3} sx={{mr: 4}}>
                            <TextField
                                type='text'
                                label='Cashier'
                                value={formData.cashier}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        cashier: e.target.value,
                                    })
                                }}
                                sx={{mt: 4, mb: 3}}
                            />
                            <TextField
                                type='text'
                                label='Wait Time'
                            />
                        </Stack>
                        <Stack direction='column' spacing={1} sx={{ml: 4}}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.greeting}
                                        value={formData.greeting}
                                        onChange={(e) =>
                                            setFormData({...formData, greeting: e.target.checked})}
                                    />
                                }
                                label='Warm Greeting'
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.orderRepeated}
                                        value={formData.orderRepeated}
                                        onChange={(e) =>
                                            setFormData({...formData, orderRepeated: e.target.checked})}
                                    />
                                }
                                label='Order was repeated'
                            />

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.upsell}
                                        value={formData.upsell}
                                        onChange={(e) =>
                                            setFormData({...formData, upsell: e.target.checked})}
                                    />
                                }
                                label='Offered upsell'
                            />
                        </Stack>
                    </Stack>
                </Box>

                {/*     SCORING Group   */}
                <Box sx={{
                    mb: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Typography sx={{display: 'flex', justifyContent: 'center', marginBottom: 3}}>Scoring</Typography>
                    <Stack direction='row' spacing={2} sx={{ mb: 4, justifyContent: 'space-between' }}>
                        <Stack spacing = {3} direction='column'>
                            <TextField
                                type='number'
                                label='Food'
                                value={formData.foodScore}
                                onChange={handleChange}
                                sx={{mt: 4, mb: 3}}
                            />
                            <TextField
                                type='number'
                                label='Service'
                                value={formData.serviceScore}
                                onChange={handleChange}
                                sx={{mt: 4, mb: 3}}
                            />
                        </Stack>
                        <Stack spacing = {3} direction='column'>
                            <TextField
                                type='number'
                                label='Clean'
                                value={formData.cleanScore}
                            />

                            <TextField
                                type='number'
                                label='Final calculated'
                                disabled
                                value={formData.finalScore}
                            />
                        </Stack>
                    </Stack>
                </Box>

                {/*     Review & Submission Group   */}
                <Box sx={{
                    mb: 2,
                    border: '1px solid #ccc',
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto'
                }}>

                    <Typography sx={{display: 'flex', justifyContent: 'center', marginBottom: 3}}>
                        Review & Submission
                    </Typography>

                    <Stack spacing={3} direction='column'>
                        <TextField
                            type='text'
                            label='Comments'
                            value={formData.comments}
                            onChange={handleChange}
                            multiline
                            rows={3}
                        />
                        <Typography>Drag N Drop Zone</Typography>
                    </Stack>
                    <Button variant='outlined'>Submit</Button>
                </Box>
            </form>
        </Box>
    );
}
