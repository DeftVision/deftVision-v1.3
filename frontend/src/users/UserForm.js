
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
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={8} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
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
                            sx={{width: '500px'}}
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
                                sx={{width: '500px'}}
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
                </form>
                </Box>
            </Paper>
        </Box>
    );
};

export default UserForm;