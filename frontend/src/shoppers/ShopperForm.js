import {
    Box,
    Button,
    Paper,
    Stack,
    TextField,
    MenuItem,
    Select,
    Switch,
    FormControl,
    FormControlLabel,
    InputLabel,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { useState } from "react";

import otherLocations from "../utilities/OtherLocations";

const form_fields = {
    dateTime: Date.now(),
    shopperName: '',
    location: '',
    greeting: false,
    cashier: '',
    orderRepeated: '',
    upsell: false,
    wait: '',
    foodScore: '',
    serviceScore: '',
    cleanScore: '',
    finalScore: '',
    comments: ''
}


const steps = [
    'Logistics',
    'Ordering Process',
    'Scoring',
    'Notes'
]

export default function ShopperForm () {
    const [formData, setFormData] = useState(form_fields);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8005/api/shopper', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const _response = await response.json()
            if(response.ok && _response.shopper) {
                setFormData(formData)
                console.log(_response.message)
            } else {
                console.error('invalid response structure', _response.error)
            }
        } catch (error) {
            console.log('failed to submit',error)
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <form onSubmit={handleSubmit}>
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
                                sx={{width: '500px'}}
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
                                sx={{width: '500px'}}
                            />
                            <FormControl>
                                <InputLabel>Location</InputLabel>
                                <Select
                                    label='Location'
                                    variant='outlined'
                                    value={formData.location || '' }
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            location: e.target.value
                                        })
                                    }}
                                    sx={{width: '500px'}}

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
                                label='Cashier Name '
                                value={formData.cashier}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        cashier: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        name='greeting'
                                        checked={formData.greeting}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                greeting: e.target.checked
                                            })
                                        }}
                                    />
                                }
                                label='Warm friendly greeting'
                            >
                            </FormControlLabel>

                            <FormControlLabel
                                control={
                                    <Switch
                                        name='upsell'
                                        checked={formData.upsell}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                upsell: e.target.checked
                                            })
                                        }}
                                    />
                                }
                                label='Upsell sweet potato fries'
                            >
                            </FormControlLabel>
                            <FormControlLabel
                                control={
                                    <Switch
                                        name='greeting'
                                        checked={formData.orderRepeated}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                orderRepeated: e.target.checked
                                            })
                                        }}
                                    />
                                }
                                label='Cashier repeated the order back to you'
                            >
                            </FormControlLabel>
                            <TextField
                                type='number'
                                label='Wait time [minutes]'
                                value={formData.wait}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        wait: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            />

                            <TextField
                                type='number'
                                label='Food score [1-10]'
                                value={formData.foodScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        foodScore: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            />

                            <TextField
                                type='number'
                                label='Service score [1-10]'
                                value={formData.serviceScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        serviceScore: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            />

                            <TextField
                                type='number'
                                label='Clean score [1-10]'
                                value={formData.cleanScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        cleanScore: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            />

                            <TextField
                                type='number'
                                label='Final score [1-10]'
                                value={formData.finalScore}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        finalScore: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            />
                            <TextField
                                type='text'
                                label='Comments'
                                value={formData.comments}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        comments: e.target.value
                                    })
                                }}
                                multiline
                                rows={5}
                                sx={{width: '500px'}}
                            />




                            <Button type='submit' variant='outlined'>save</Button>
                        </Stack>
                    </form>
                </Box>
            </Paper>
        </Box>
    );
};

