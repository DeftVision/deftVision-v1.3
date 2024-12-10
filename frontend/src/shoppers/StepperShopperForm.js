import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Switch,
    TextField, Typography
} from "@mui/material";
import {useState} from "react";
import * as JSON from "uuid";
import otherLocations from '../utilities/OtherLocations'

const form_fields = {
    dateTime: Date.now(),
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
    comments: ''
}


const steps = ['Logistics', 'Ordering Process', 'Scoring', 'Finalize']

export default function ShopperForm() {
    const [formData, setFormData] = useState(form_fields);
    const [activeStep, setActiveStep] = useState(0);

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
                return formData.comments.trim();
            default:
                return false;
        }

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8005/api/shopper', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const _response = await response.json();
            if (response.ok && _response.shopper) {
                setFormData(form_fields);
                console.log(_response.message);
            } else {
                console.error('Invalid response structure', _response.error)
            }

        } catch (error) {
            console.log('Failed to submit', error);
        }
    }

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
                        <TextField
                            type='text'
                            label='Shopper Name'
                            value={formData.shopperName}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    shopperName: e.target.value
                                })
                            }}
                            sx={{maxWidth: '500px'}}
                        />

                        <FormControl>
                            <InputLabel>Location</InputLabel>
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
                            value={formData.foodScore}
                            onChange={(e) =>
                                setFormData({...formData, foodScore: e.target.value})
                            }
                            sx={{ maxWidth: '500px' }}
                        />
                        <TextField
                            type='number'
                            label='Service Score [1-10]'
                            value={formData.serviceScore}
                            onChange={(e) =>
                                setFormData({...formData, serviceScore: e.target.value})
                            }
                            sx={{ maxWidth: '500px' }}
                            required
                        />
                        <TextField
                            type='number'
                            label='Clean Score [1-10]'
                            value={formData.cleanScore}
                            onChange={(e) =>
                                setFormData({...formData, cleanScore: e.target.value})
                            }
                            sx={{ maxWidth: '500px' }}
                        />
                        <TextField
                            type='number'
                            label='Final Score [1-10]'
                            value={formData.finalScore}
                            onChange={(e) =>
                                setFormData({...formData, finalScore: e.target.value})
                            }
                            sx={{ maxWidth: '500px' }}
                            disabled
                        />
                    </Stack>
                );
            case 3:
                return (
                    <Box  sx={{display: 'flex', justifyContent: 'center'}}>
                        <TextField
                            type='text'
                            label='Comments'
                            value={formData.comments}
                            onChange={(e) =>
                                setFormData({...formData, comments: e.target.value})
                            }
                            multiline
                            rows={5}
                            sx={{ width: '100%', maxWidth: '500px'}}
                        />
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
            {/*<Paper elevation={16}
                   sx={{ padding: 5, maxWidth: '1200px', width: '90%', overflow: 'hidden'}}
            >*/}
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
            {/*</Paper>*/}
        </Box>
    );
};

