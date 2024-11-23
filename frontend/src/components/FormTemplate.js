import React, { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, Typography, Stack } from '@mui/material';

export default function FormTemplate() {
    const [templateName, setTemplateName] = useState('');
    const [fields, setFields] = useState([]);

    const handleAddField = () => {
        setFields((prevState) => [
            ...prevState,
            { id: Date.now(), type: ''},
        ]);
    }

    const handleFieldTypeChange = (id, newType) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, type: newType } : field
        )
        );
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Stack spacing={2}>
                <Typography variant='overline'>Create Form Template</Typography>
                <TextField
                    label='Template Name'
                    varian='outlined'
                    fullwidth
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />

                <Button variant='outlined' onClick={handleAddField}>
                    Add Field
                </Button>

                <Box>
                    <Typography variant='overline'>Template Preview</Typography>
                    {fields.map((field, index) => (
                        <Stack key={field.id} direction='row' spacing={2} alignItems='center'>
                            <Typography>{index + 1}.</Typography>

                            <Select
                                value={field.type}
                                onChange={(e) => handleFieldTypeChange(field.id, e.target.value)}
                                displayEmpty
                                fullwidth
                                sx={{width: '200px'}}
                                variant='outlined'
                                >
                                <MenuItem value='' disabled>
                                    Select field type
                                </MenuItem>
                                <MenuItem value='text'>Text</MenuItem>
                                <MenuItem value='multiline'>Multiline</MenuItem>
                                <MenuItem value='number'>Number</MenuItem>
                                <MenuItem value='checkbox'>Checkbox</MenuItem>
                                <MenuItem value='switch'>Toggle</MenuItem>
                                <MenuItem value='dateTime'>Date Time</MenuItem>
                                <MenuItem value='dropdown'>Dropdown</MenuItem>
                                <MenuItem value='upload'>Image Upload</MenuItem>
                            </Select>
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </Box>
    );



}


