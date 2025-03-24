// /components/ShopperForm.js
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel, LinearProgress,
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
import FileUploader from "../utilities/FileUploader";

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
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // group valid states
    const [logisticsValid, setLogisticsValid] = useState(false)
    const [interactionValid, setInteractionValid] = useState(false)
    const [scoringValid, setScoringValid] = useState(false)
    const [submitReviewValid, setSubmitReviewValid] = useState(false)

    // group errors state
    const [logisticsFieldErrors, setLogisticsFieldErrors] = useState({})
    const [interactionFieldErrors, setInteractionFieldErrors] = useState({})
    const [scoringFieldErrors, setScoringFieldErrors] = useState({})
    const [submitReviewFieldErrors, setSubmitReviewFieldErrors] = useState({})

    // group touched states
    const [logisticsTouched, setLogisticsTouched] = useState(false);
    const [interactionTouched, setInteractionTouched] = useState(false);
    const [scoringTouched, setScoringTouched] = useState(false);
    const [submitReviewTouched, setSubmitReviewTouched] = useState(false);

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
            imageUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newFileKey}`
        }));
    };

    const handleFileSelection = (file) => {
        console.log("File selected:", file.name);
        setSelectedFile(file);
        setUploadProgress(0);
    };

    const validateLogisticsGroup = (formData) => {
        const { location, shopperName } = formData;

        const fieldErrors = {}
        if(location === "") {
            fieldErrors.location = "Location is required";
        }
        if (shopperName === "") {
            fieldErrors.shopperName = "You must be logged in to submit this form."
        }

        const isValid = Object.keys(fieldErrors).length === 0;

        return {
            isValid,
            fieldErrors
        }
    }

    const validateInteractionGroup = (formData) => {
        const { cashier, wait } = formData

        const fieldErrors = {}
        if (cashier === "") {
            fieldErrors.cashier = "The cashier name field needs a value";
        }
        if (wait === "") {
            fieldErrors.wait = "The wait time field needs a value";
        }

        const isValid =  Object.keys(fieldErrors).length === 0;

        return {
            isValid,
            fieldErrors,
        }

    }

    const validateScoringGroup = (formData) => {
        const { foodScore, cleanScore, serviceScore } = formData

        const fieldErrors = {}
        if (foodScore === "") {
            fieldErrors.foodScore = "A food score is required";
        }
        if (cleanScore === "") {
            fieldErrors.cleanScore = "A cleanliness score is required";
        }

        if (serviceScore === "") {
            fieldErrors.serviceScore = "A service score is required";
        }


        const isValid = Object.keys(fieldErrors).length === 0;

        return {
            isValid,
            fieldErrors,
        }

    }

    const validateSubmitReviewGroup = (formData, selectedFile) => {
        const { comments } = formData
        const fieldErrors = {}

        if (comments === "") {
            fieldErrors.comments = "The comments field needs a value";
        }

        if (!selectedFile) {
            fieldErrors.upload = "An image is required";
        }

        const isValid =  Object.keys(fieldErrors).length === 0;

        return {
            isValid,
            fieldErrors,
        }
    }

    // HANDLE FORM SUBMISSION
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLogisticsTouched(true);
        setInteractionTouched(true);
        setScoringTouched(true);
        setSubmitReviewTouched(true);

        // validation for all groups
        const logisticResult = validateLogisticsGroup(formData);
        const interactionResult = validateInteractionGroup(formData);
        const scoringResult = validateScoringGroup(formData);
        const submitReviewResult = validateSubmitReviewGroup(formData, selectedFile);


        //   update state for all GROUP include invalid
        setLogisticsValid(logisticResult.isValid)
        setLogisticsFieldErrors(logisticResult.fieldErrors)

        setInteractionValid(interactionResult.isValid)
        setInteractionFieldErrors(interactionResult.isValid)

        setScoringValid(scoringResult.isValid)
        setScoringFieldErrors(scoringResult.isValid)


        setSubmitReviewValid(submitReviewResult.isValid)
        setSubmitReviewFieldErrors(submitReviewResult.fieldErrors)


       //   if any group is invalid  → show toast + return
        if (
            !logisticResult.isValid ||
            !interactionResult.isValid ||
            !scoringResult.isValid ||
            !submitReviewResult.isValid
        ) {
            showNotification("please complete all required fields", "error")
            return
        }





        if (!selectedFile) {
            showNotification("Please select a file before submitting", "error");
            return;
        }

        setUploading(true);

        try {

            const preSignedUrlResponse = await fetch(`${process.env.REACT_APP_API_URL}/shopper/get-presigned-upload-url`, {
                method: 'POST',
                body: JSON.stringify({
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });


            const { presignedUrl, fileKey } = await preSignedUrlResponse.json();
            console.log("Presigned URL:", presignedUrl)
            console.log("File Key:", fileKey)

            const s3UploadResponse  = await fetch(presignedUrl, {
                method: 'PUT',
                headers: {
                    "Content-Type": selectedFile.type,
                },
                body: selectedFile
            })

            if (!s3UploadResponse.ok) {
                throw new Error("Failed to upload file to S3");
            }

            const requestData = {
                ...formData,
                fileKey,
                uploadedBy: sessionStorage.getItem("userEmail") || "Unknown User",
            };

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
        <Box sx={{width: '100%', px: 2, mb: 15}}>

            <form onSubmit={handleSubmit}>

                {/*     LOGISTICS Group     */}
                <Box sx={{
                    mb: 2,
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: logisticsTouched
                        ? logisticsValid
                            ? "1px solid green"
                            : "1px solid red"
                        : "1px solid #ccc"
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
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: interactionTouched
                        ? interactionValid
                            ? "1px solid green"
                            : "1px solid red"
                        : "1px solid #ccc"
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
                                value={formData.wait}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        wait: e.target.value,
                                    })
                                }}
                                sx={{mt: 4, mb: 3}}
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
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: scoringTouched
                        ? scoringValid
                            ? "1px solid green"
                            : "1px solid red"
                        : "1px solid #ccc"
                }}>
                    <Typography sx={{display: 'flex', justifyContent: 'center', marginBottom: 3}}>Scoring</Typography>
                    <Stack direction='row' spacing={2} sx={{ mb: 4, justifyContent: 'space-between' }}>
                        <Stack spacing = {3} direction='column'>
                            <TextField
                                type='number'
                                label='Food'
                                value={formData.foodScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        foodScore: e.target.value,
                                    })
                                }}
                                sx={{mt: 4, mb: 3}}
                            />
                            <TextField
                                type='number'
                                label='Service'
                                value={formData.serviceScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        serviceScore: e.target.value,
                                    })
                                }}
                                sx={{mt: 4, mb: 3}}
                            />
                        </Stack>
                        <Stack spacing = {3} direction='column'>
                            <TextField
                                type='number'
                                label='Clean'
                                value={formData.cleanScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        cleanScore: e.target.value,
                                    })
                                }}
                                sx={{mt: 4, mb: 3}}
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
                    borderRadius: 2,
                    p: 2,
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    border: submitReviewTouched
                        ? submitReviewValid
                            ? "1px solid green"
                            : "1px solid red"
                        : "1px solid #ccc"
                }}>

                    <Typography sx={{display: 'flex', justifyContent: 'center', marginBottom: 3}}>
                        Review & Submission
                    </Typography>

                    <Stack spacing={3} direction='column'>
                        <TextField
                            type='text'
                            label='Comments'
                            value={formData.comments}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    comments: e.target.value,
                                })
                            }}
                            multiline
                            rows={3}
                        />
                        <FileUploader onFileSelect={handleFileSelection} />
                        {uploading && <LinearProgress variant="determinate" value={uploadProgress} sx={{ width: "100%" }} />}
                    </Stack>
                    <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center'}}>
                        <Button variant='outlined' type='submit'>Submit</Button>
                    </Box>
                </Box>
            </form>
        </Box>
    );
}
