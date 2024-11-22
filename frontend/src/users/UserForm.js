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
import { useState, useEffect } from "react";

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



    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} width='100%' sx={{padding: 5, maxWidth: '1200px', width: '90%', }}>

                <Box component='form' sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
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
                                    //onChange={handleFieldChange}
                                />
                            }
                            label='User is active'
                        >
                        </FormControlLabel>
                        <Button variant='outlined'>save</Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserForm;