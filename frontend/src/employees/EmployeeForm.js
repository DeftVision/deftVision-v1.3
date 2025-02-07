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
    FormControlLabel,
    Switch,
} from '@mui/material';
import { useState } from 'react';
import { useNotification } from '../utilities/NotificationContext';
import otherLocations from '../utilities/OtherLocations';
import positions from '../utilities/Positions';

const form_fields = {
    firstName: '',
    lastName: '',
    location: '',
    position: '',
    isActive: true,
};

export default function EmployeeForm({ onEmployeeCreated }) {
    const [formData, setFormData] = useState(form_fields);
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/employee`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const _response = await response.json();
            if (response.ok && _response.employee) {
                setFormData(form_fields);
                onEmployeeCreated();
                showNotification('Employee created successfully', 'success');
            } else {
                showNotification('Error saving employee', 'error');
            }
        } catch (error) {
            showNotification('Oops, there was an error', 'error');
        }
    };

    return (
        <Box sx={{ px: 2, py: 4 }}>
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
                    <FormControl fullWidth>
                        <InputLabel>Location</InputLabel>
                        <Select
                            variant='standard'
                            value={formData.location}
                            onChange={(e) =>
                                setFormData({ ...formData, location: e.target.value })
                            }
                        >
                            {otherLocations.map((loc) => (
                                <MenuItem key={loc} value={loc}>
                                    {loc}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel>Position</InputLabel>
                        <Select
                            variant='standard'
                            label='Position'
                            value={formData.position}
                            onChange={(e) =>
                                setFormData({ ...formData, position: e.target.value })
                            }
                        >
                            {positions.map((pos) => (
                                <MenuItem key={pos} value={pos}>
                                    {pos}
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
                        label="Employee is Active"
                    />
                    <Button type="submit" variant="contained">
                        Save Employee
                    </Button>
                </Stack>
            </form>
        </Box>
    );
}
