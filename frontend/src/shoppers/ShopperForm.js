import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Switch,
    TextField,
    Typography,
} from "@mui/material";
import { useState,  useEffect } from "react";
import otherLocations from '../utilities/OtherLocations'
import { useNotification } from '../utilities/NotificationContext'
import {FileUploader} from "../utilities/index";

const getLocalISO = () => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localTime = new Date(now.getTime() - offsetMs);
    return localTime.toISOString().slice(0, 16);
};

const form_fields = {
    dateTime: getLocalISO(),
    shopperName: '',
    location: '',
    greeting: false,
    cashier: '',
    orderRepeated: false,
    upsell: false,
    wait: '',
    foodScore: '',
    serviceScore: '',
    cleanScore: '',
    finalScore: '',
    comments: '',
    image: null
};



const steps = ['Logistics', 'Ordering Process', 'Scoring', 'Finalize']

export default function ShopperForm() {
    const [formData, setFormData] = useState(form_fields);
    const [activeStep, setActiveStep] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { showNotification } = useNotification();


    useEffect(() => {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        if (user?.firstName && user?.lastName) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                shopperName: `${user.firstName} ${user.lastName}`,
            }));
        }
    }, []);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const validateStep = (step) => {
        switch(step) {
            case 0:
                return (
                    formData.dateTime &&
                    formData.shopperName.trim() &&
                    formData.location.trim() &&
                    formData.cashier.trim()
                );
            case 1:
                return formData.wait !== "";

            case 2:
                return (
                    formData.foodScore &&
                    formData.serviceScore &&
                    formData.cleanScore
                );
            case 3:
                return (
                    formData.comments.trim() &&
                    formData.image !== null
                );
            default:
                return false;
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
                if (formData[key] !== null) {
                    formDataObj.append(key, formData[key])
                }

        })
        try {
            const response = await fetch('http://localhost:8005/api/shopper', {
                method: 'POST',
                body: formDataObj,
            });
            const _response = await response.json();
            if (response.ok && _response.shopper) {
                setFormData(form_fields);
                showNotification('form saved successfully', 'success')
            } else {
                showNotification('form failed to save', 'error')
            }

        } catch (error) {
            showNotification('failed to save form', 'error')
        }
    }

    const calculateAverage = (foodScore, serviceScore, cleanScore) => {
        const scores = [foodScore, serviceScore, cleanScore].filter((score) => score !== undefined && score !== '');
        if (scores.length === 0) return '';
        const total = scores.reduce((sum, score) => sum + score, 0);
        return (total / scores.length).toFixed(2); // Rounded to 1 decimal place
    };


    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Stack direction='column' spacing={3}>
                        <TextField
                            type='datetime-local'
                            label='Visit Date'
                            value={formData.dateTime}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    dateTime: e.target.value
                                })
                            }}
                            sx={{maxWidth: '500px'}}
                        />
                        <input
                            type='hidden'
                            value={formData.shopperName}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    shopperName: e.target.value
                                })
                            }}
                        />
                        <FormControl>
                            <InputLabel required>Location</InputLabel>
                            <Select
                                variant='outlined'
                                label='location'
                                value={formData.location || ""}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        location: e.target.value
                                    })
                                }}
                                sx={{maxWidth: '500px'}}
                            >
                                {otherLocations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            type='text'
                            label='Cashier Name/Description'
                            value={formData.cashier}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    cashier: e.target.value
                                })
                            }}
                            sx={{maxWidth: '500px'}}
                            required
                        />

                    </Stack>
                );
            case 1:
                return (
                    <Stack direction='column' spacing={3}>
                        <FormControlLabel
                            control={
                                <Switch
                                    name='greeting'
                                    checked={formData.greeting}
                                    onChange={(e) =>
                                        setFormData({...formData, greeting: e.target.checked})
                                    }
                                />
                            }
                            label='Warm friendly greeting'
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name='upsell'
                                    checked={formData.upsell}
                                    onChange={(e) =>
                                        setFormData({...formData, upsell: e.target.checked})
                                    }
                                />
                            }
                            label='Offered sweet potato fries'
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    name='orderRepeated'
                                    checked={formData.orderRepeated}
                                    onChange={(e) =>
                                        setFormData({...formData, orderRepeated: e.target.checked})
                                    }
                                />
                            }
                            label='Did the cashier read back your order'
                        />

                        <TextField
                            type='number'
                            label='Wait time [in minutes]'
                            value={formData.wait}
                            onChange={(e) =>
                                setFormData({ ...formData, wait: e.target.value})
                            }
                            sx={{ maxWidth: '500px'}}
                        />
                    </Stack>

                );

            case 2:
                return (
                    <Stack direction='column' spacing={3}>
                        <TextField
                            type='number'
                            label='Food Score [1-10]'
                            autoComplete='off'
                            value={formData.foodScore || ''}
                            onChange={(e) => {
                                const foodScore = Number(e.target.value);
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    foodScore,
                                    finalScore: calculateAverage(foodScore, prevFormData.serviceScore, prevFormData.cleanScore),
                                }));
                            }}
                            sx={{ maxWidth: '500px' }}
                            required
                        />
                        <TextField
                            type='number'
                            label='Service Score [1-10]'
                            autoComplete='off'
                            value={formData.serviceScore || ''}
                            onChange={(e) => {
                                const serviceScore = Number(e.target.value);
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    serviceScore,
                                    finalScore: calculateAverage(prevFormData.foodScore, serviceScore, prevFormData.cleanScore),
                                }))
                            }}

                            sx={{ maxWidth: '500px' }}
                            required
                        />
                        <TextField
                            type='number'
                            label='Clean Score [1-10]'
                            autoComplete='off'
                            value={formData.cleanScore || ''}
                            onChange={(e) => {
                                const cleanScore = Number(e.target.value);
                                setFormData((prevFormData) => ({
                                    ...prevFormData,
                                    cleanScore,
                                    finalScore: calculateAverage(prevFormData.foodScore, prevFormData.serviceScore, cleanScore),
                                }));
                            }}
                            sx={{ maxWidth: '500px' }}
                            required
                        />
                        <TextField
                            type='number'
                            label='Final Score'
                            variant='filled'
                            value={formData.finalScore}
                            onChange={(e) =>
                                setFormData({...formData, finalScore: e.target.value})
                            }
                            sx={{ maxWidth: '500px' }}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />
                    </Stack>
                );
            case 3:
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Stack direction="column" spacing={3}>
                            <TextField
                                type="text"
                                label="Comments"
                                value={formData.comments}
                                onChange={(e) =>
                                    setFormData({ ...formData, comments: e.target.value })
                                }
                                multiline
                                rows={5}
                                sx={{ width: '100%', maxWidth: '500px' }}
                            />
                            <FileUploader
                                acceptedTypes={[
                                    'image/jpeg',
                                    'image/png',
                                    'application/pdf',
                                    'text/plain',
                                    'video/mp4',
                                    '.docx',
                                    '.xlsx',
                                ]}
                                maxSize={5 * 1024 * 1024} // 5 MB
                                onFileSelect={(image) =>
                                    setFormData({ ...formData, image })
                                }
                            />
                            {formData.file && (
                                <Typography>
                                    Selected file: {formData.file.name}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                );
            default:
                return <Box sx={{ textAlign: 'center', marginBottom: 5}}>
                    <Typography variant='overline' sx={{fontSize: '1.25rem', fontWeight: 'bold'}}>
                        Shopper Visit Recorded
                    </Typography>
                </Box>
        }
    };


    return (
        <Box width='100%' sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
            <Stack direction='column' spacing={3}>
                <Stepper activeStep={activeStep} alternativeLabel sx={{ padding: 5}}>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box sx={{ marginTop: 5 }}>{renderStepContent(activeStep)}</Box>
                <Stack direction='row' spacing={2} justifyContent='space-between' sx={{ mt: 3}}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant='text'
                    >
                        Back
                    </Button>
                    {activeStep === steps.length -1 ? (
                        <Button
                            onClick={handleSubmit}
                            variant='text'
                            disabled={!validateStep(activeStep)}
                        >
                            Submit
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            variant='text'
                            disabled={!validateStep(activeStep)}
                        >
                            Next
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
};

