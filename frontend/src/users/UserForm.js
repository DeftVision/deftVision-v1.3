// /users/UserForm.js
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    Stack,
    FormControl,
    InputLabel,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotification } from '../utilities/NotificationContext';
import roles from '../utilities/Roles'; // ✅ Imported roles utility

const form_fields = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    isActive: true,
};

export default function UserForm({ onUserUpdated, editData }) {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    useEffect(() => {
        if (editData) {
            console.log('🔹 Received editData:', editData); // Debugging output

            const nameParts = editData.name ? editData.name.split(' ') : [];
            const firstName = nameParts[0] || ''; // First word
            const lastName = nameParts.slice(1).join(' ') || ''; // Everything else

            setFormData({
                id: editData.id || '',
                firstName: firstName,
                lastName: lastName,
                email: editData.email || '',
                role: editData.role || '',
                isActive: editData.isActive ?? true,
            });

        }
    }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            showNotification('First and Last Name are required', 'error');
            return;
        }
        if (!formData.email.trim()) {
            showNotification('Email is required', 'error');
            return;
        }

        const method = formData.id ? 'PATCH' : 'POST';
        const url = formData.id
            ? `${process.env.REACT_APP_API_URL}/user/${formData.id}`
            : `${process.env.REACT_APP_API_URL}/user`;

        try {
            const response = await fetch(url, {
                method,
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' },
            });

            const _response = await response.json();
            if (response.ok && _response.user) {
                showNotification('User saved successfully', 'success');
                onUserUpdated();
                setFormData(form_fields);
            } else {
                showNotification(_response.message || 'Error saving user', 'error');
            }
        } catch (error) {
            console.error('Error saving user:', error);
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
                        onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Email" // ✅ Editable Email Field
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                    <FormControl fullWidth>
                        <InputLabel>Role</InputLabel>
                        <Select
                            variant="outlined"
                            label="Role"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({ ...formData, role: e.target.value })
                            }
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
                                checked={formData.isActive}
                                onChange={(e) =>
                                    setFormData({ ...formData, isActive: e.target.checked })
                                }
                            />
                        }
                        label="Active"
                    />

                    <Button type="submit" variant="contained">
                        Save User
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
