// /components/EmployeeForm.js
import {
    Box,
    Stack,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Switch, FormControlLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotification } from '../utilities/NotificationContext';
import { positions, locations } from '../utilities/index';


const form_fields = {
    firstName: '',
    lastName: '',
    email: '',
    position: '',
    location: '',
    isActive: true,
};

export default function EmployeeForm({ editData, onEmployeeSaved }) {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (editData) {
            console.log("🔹 Received editData in EmployeeForm:", editData); // ✅ Debugging

            const [firstName, lastName] = editData.name?.split(" ") || ["", ""]; // ✅ Split full name

            setFormData({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: editData.email || "", // ✅ Check if email exists
                location: editData.location || "",
                position: editData.position || "",
                isActive: editData.isActive ?? true,
            });
        }
    }, [editData]);




    const handleSubmit = async (e) => {
        e.preventDefault();
        const isUpdating = Boolean(editData?.id);

        const url = isUpdating
            ? `${process.env.REACT_APP_API_URL}/employee/${editData.id}`
            : `${process.env.REACT_APP_API_URL}/employee`;

        const method = isUpdating ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });

            const _response = await response.json();
            if (response.ok) {
                showNotification(isUpdating ? 'Employee updated successfully' : 'Employee created successfully', 'success');
                onEmployeeSaved();
                setFormData(form_fields);
            } else {
                showNotification(_response.message || 'Error saving employee', 'error');
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            showNotification('An error occurred while saving the employee', 'error');
        }
    };

    return (
        <Box sx={{ width: '100%', px: 2, mb: 4 }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />

                    {/* ✅ Use Positions.js for dropdown */}
                    <FormControl fullWidth>
                        <InputLabel>Position</InputLabel>
                        <Select
                            variant="outlined"
                            label="Position"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        >
                            {positions.map((pos) => (
                                <MenuItem key={pos} value={pos}>
                                    {pos}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* ✅ Use UserLocations.js for dropdown */}
                    <FormControl fullWidth>
                        <InputLabel>Location</InputLabel>
                        <Select
                            variant="outlined"
                            label="Location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        >
                            {locations.map((location) => (
                                <MenuItem key={location} value={location}>
                                    {location}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                        }
                        label="Is Active"

                    />

                    <Button type="submit" variant="contained">
                        {editData ? 'Update Employee' : 'Save Employee'}
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
