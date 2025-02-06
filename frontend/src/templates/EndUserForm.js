import { useState, useEffect } from 'react';
import { Box, Typography, Button, Select, MenuItem, TextField, Stack } from '@mui/material';

export default function EndUserForm() {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [responses, setResponses] = useState({});

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/template/published`);
                const _response = await response.json();

                if (response.ok) {
                    setTemplates(_response.templates);
                } else {
                    console.log(_response.message || 'Failed to fetch templates');
                }
            } catch (error) {
                console.error('Error fetching templates:', error);
            }
        };

        fetchTemplates();
    }, []);


    const handleFieldChange = (fieldId, value) => {
        setResponses((prev) => ({
            ...prev,
            [fieldId]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!selectedTemplate) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/responses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    templateId: selectedTemplate._id,
                    responses: Object.entries(responses).map(([fieldId, response]) => ({
                        fieldId,
                        response,
                    })),
                }),
            });

            const _response = await response.json();
            if (response.ok) {
                setSelectedTemplate(null);
                setResponses({});
            } else {
                console.log(_response.message || 'Failed to submit responses');
            }
        } catch (error) {
            console.error('Error submitting responses:', error);
            console.log('Failed to submit responses.');
        }
    };

    return (
        <Box sx={{ padding: 2, textAlign: 'center', width: '500px' }}>
            <Typography variant="overline" sx={{fontSize: '1rem'}}>select a form</Typography>
            <Stack direction='column' spacing={2}>
                <Select
                    variant='outlined'
                    fullWidth
                    value={selectedTemplate ? selectedTemplate._id : ''}
                    onChange={(e) =>
                        setSelectedTemplate(
                            templates.find((template) => template._id === e.target.value)
                        )
                    }
                    displayEmpty
                    sx={{textAlign: 'start', width: '500px'}}
                >
                    <MenuItem value="" disabled>
                        Select a Form
                    </MenuItem>
                    {templates.map((template) => (
                        <MenuItem key={template._id} value={template._id}>
                            {template.name}
                        </MenuItem>
                    ))}
                </Select>

                {selectedTemplate && (
                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h5">{selectedTemplate.name}</Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            {selectedTemplate.description}
                        </Typography>
                        <Stack spacing={2}>
                            {selectedTemplate.fields.map((field) => (
                                <Box key={field.id}>
                                    {field.type === 'text' && (
                                        <TextField
                                            label={field.label}
                                            fullWidth
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'number' && (
                                        <TextField
                                            type="number"
                                            label={field.label}
                                            fullWidth
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        />
                                    )}
                                    {field.type === 'dropdown' && (
                                        <Select
                                            label={field.label}
                                            variant='outlined'
                                            fullWidth
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                        >
                                            {field.options.map((option, idx) => (
                                                <MenuItem key={idx} value={option}>
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                    {/* Add other field types as needed */}
                                </Box>
                            ))}
                        </Stack>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 4 }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                )}
            </Stack>
        </Box>
    );
}
