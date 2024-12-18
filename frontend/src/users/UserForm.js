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
import roles from "../utilities/Roles";

const form_fields = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '',
    location: '',
    isActive: true,
}

const UserForm = () => {
    const [formData, setFormData] = useState(form_fields);

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8005/api/user', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const _response = await response.json()
        if(response.ok && _response.user) {
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
        <Box sx={{justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5 }}>

                <Box component='form' onSubmit={handleSubmit} sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
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
                        />
                        <TextField
                            type='email'
                            label='Email'
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }}
                        />
                        <TextField
                            type='password'
                            label='Password'
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    password: e.target.value
                                })
                            }}
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

                            >
                                {locations.map((location) => (
                                    <MenuItem key={location} value={location}>
                                        {location}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <InputLabel>Role</InputLabel>
                            <Select
                                label='Location'
                                variant='outlined'
                                value={formData.role || '' }
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        role: e.target.value
                                    })
                                }}

                            >
                                {roles.map((role) => (
                                    <MenuItem key={role} value={role}>
                                        {role}
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
                            label='User is active'
                        >
                        </FormControlLabel>
                        <Button type='submit' variant='outlined'>save</Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserForm;