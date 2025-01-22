// /components/ShopperForm.js
import {
    Box,
    Button,
    Stack,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { FileUploader } from '../utilities';
import { useNotification } from '../utilities/NotificationContext';
import otherLocations from '../utilities/OtherLocations';

export default function ShopperForm() {
    const [formData, setFormData] = useState({ dateTime: '', location: '', finalScore: '' });
    const [activeStep, setActiveStep] = useState(0);

    const steps = ['Details', 'Scores', 'Finalize'];

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    return (
        <Box sx={{ px: 2 }}>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <Stack spacing={2}>
                {activeStep === 0 && (
                    <TextField
                        label="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        fullWidth
                    />
                )}
                {/* Add more steps */}
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                </Button>
                <Button onClick={handleNext}>
                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                </Button>
            </Stack>
        </Box>
    );
}
