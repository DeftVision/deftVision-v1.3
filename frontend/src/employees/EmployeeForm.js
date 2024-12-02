import React from 'react';
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
    InputLabel
} from "@mui/material";
import { useState } from "react";

import locations from "../utilities/Locations";
import positions from "../utilities/Positions";

const form_fields = {
        firstName: '',
        lastName: '',
        location: '',
        position: '',
        isActive: true,
}

const EmployeeForm = () => {
    const [formData, setFormData] = useState(form_fields);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8005/api/employee', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const _response = await response.json()
            if(response.ok && _response.employee) {
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
        <Box sx={{ padding: 2, marginBottom: 10}}>
            <form onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3}>
                    <TextField
                        type='text'
                        label='First Name'
                        value={formData.firstName}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                firstName: e.target.value
                            })
                        }}
                        sx={{width: '500px'}}
                    />
                    <TextField
                        type='text'
                        label='Last Name'
                        value={formData.lastName}
                        onChange={(e) => {
                            setFormData({
                                ...formData,
                                lastName: e.target.value
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
                            {locations.map((location) => (
                                <MenuItem key={location} value={location}>
                                    {location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl>
                        <InputLabel>Position</InputLabel>
                        <Select
                            label='Position'
                            variant='outlined'
                            value={formData.position || '' }
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    position: e.target.value
                                })
                            }}
                            sx={{width: '500px'}}
                        >
                            {positions.map((position) => (
                                <MenuItem key={position} value={position}>
                                    {position}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Switch
                                name='isActive'
                                checked={formData.isActive}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        isActive: e.target.checked
                                    })
                                }}
                            />
                        }
                        label='Employee is active'
                    >
                    </FormControlLabel>
                    <Button type='submit' variant='outlined'>save</Button>
                </Stack>
            </form>
        </Box>
    );
};

export default EmployeeForm;