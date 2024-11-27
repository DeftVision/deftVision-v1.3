import { useState } from 'react';
import { Box, TextField, Button, Select, MenuItem, Typography, Stack, Switch, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FormTemplate() {
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [fields, setFields] = useState([]);

    const handleAddField = () => {
        setFields((prevState) => [
            ...prevState,
            { id: Date.now(), type: '', label: '', required: false, options: [] },
        ]);
    };

    const handleFieldTypeChange = (id, newType) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id
                    ? { ...field, type: newType, options: newType === 'dropdown' ? [] : field.options }
                    : field
            )
        );
    };

    const handleFieldLabelChange = (id, newLabel) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, label: newLabel } : field
            )
        );
    };

    const handleFieldRequiredChange = (id, newRequired) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, required: newRequired } : field
            )
        );
    };

    const handleAddOption = (id, option) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id
                    ? { ...field, options: [...field.options, option] }
                    : field
            )
        );
    };

    const handleRemoveOption = (id, optionIndex) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id
                    ? {
                        ...field,
                        options: field.options.filter((_, index) => index !== optionIndex),
                    }
                    : field
            )
        );
    };

    return (
        <Box sx={{ padding: 2, marginBottom: 10 }}>
            <Stack spacing={2}>
                <Typography variant="h5" sx={{textAlign: 'center'}}>Create Form Template</Typography>
                <TextField
                    label="Template Name"
                    variant="outlined"
                    fullWidth
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />

                <TextField
                    label="Template Description"
                    variant="outlined"
                    multiline
                    rows={5}
                    fullWidth
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                />

                <Button variant="contained" onClick={handleAddField}>
                    Add Field
                </Button>

                <Box sx={{marginBottom: 10}}>
                    <Typography variant="overline" sx={{fontSize: '1rem', textAlign: 'center', marginBottom: 6}}>Fields</Typography>
                    {fields.map((field, index) => (
                        <Stack key={field.id} spacing={2} sx={{ marginBottom: 2 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography sx={{marginTop: 5}}>{index + 1}.</Typography>

                                <Select
                                    variant='outlined'
                                    value={field.type}
                                    onChange={(e) => handleFieldTypeChange(field.id, e.target.value)}
                                    displayEmpty
                                    fullWidth
                                    sx={{ width: '150px' }}
                                >
                                    <MenuItem value="" disabled>
                                        Select Field Type
                                    </MenuItem>
                                    <MenuItem value="text">Text</MenuItem>
                                    <MenuItem value="multiline">Multiline</MenuItem>
                                    <MenuItem value="number">Number</MenuItem>
                                    <MenuItem value="checkbox">Checkbox</MenuItem>
                                    <MenuItem value="switch">Switch</MenuItem>
                                    <MenuItem value="dateTime">Date & Time</MenuItem>
                                    <MenuItem value="dropdown">Dropdown</MenuItem>
                                </Select>

                                <TextField
                                    label="Field Label"
                                    variant="outlined"
                                    value={field.label}
                                    onChange={(e) => handleFieldLabelChange(field.id, e.target.value)}
                                    fullWidth
                                    sx={{ width: '200px' }}
                                />

                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography>Required</Typography>
                                    <Switch
                                        checked={field.required}
                                        onChange={(e) =>
                                            handleFieldRequiredChange(field.id, e.target.checked)
                                        }
                                    />
                                </Stack>
                            </Stack>

                            {field.type === 'dropdown' && (
                                <Box>
                                    <Typography variant="overline">Options:</Typography>
                                    {field.options.map((option, optionIndex) => (
                                        <Stack
                                            key={optionIndex}
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            sx={{marginBottom: 2}}
                                        >
                                            <Typography>{optionIndex + 1}.</Typography>
                                            <TextField
                                                value={option}
                                                variant="outlined"
                                                disabled
                                                fullWidth
                                            />
                                            <IconButton
                                                onClick={() => handleRemoveOption(field.id, optionIndex)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    ))}
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <TextField
                                            label="New Option"
                                            variant="outlined"
                                            size="small"
                                            sx={{ flexGrow: 1 }}
                                            inputRef={(input) =>
                                                (field.newOptionInputRef = input)
                                            } // Save ref to input element
                                        />
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => {
                                                const newOption =
                                                    field.newOptionInputRef?.value.trim();
                                                if (newOption) {
                                                    handleAddOption(field.id, newOption);
                                                    field.newOptionInputRef.value = '';
                                                }
                                            }}
                                        >
                                            Add Option
                                        </Button>
                                    </Stack>
                                </Box>
                            )}
                        </Stack>
                    ))}
                </Box>
            </Stack>
        </Box>
    );
}
