import { useState } from 'react';
import { Box, TextField, Button, Select, Divider, MenuItem, Typography, Stack, Switch, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function FormTemplate() {
    const [templateName, setTemplateName] = useState('');
    const [templateDescription, setTemplateDescription] = useState('');
    const [fields, setFields] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);

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

    const handleSaveTemplate = async () => {
        try {
            const response = await fetch('http://localhost:8005/api/template', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    templateName,
                    templateDescription,
                    fields,
                }),
            });

            const _response = await response.json();
            if(response.ok) {
                console.log(_response.message)
            } else {
                console.log(_response.message);
            }
        } catch (error) {
            console.error('Error saving template');
        }
    }

    const handleSaveDraft = async () => {
        try {
            const response = await fetch('http://localhost:8005/api/template/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                        templateName,
                        templateDescription,
                        status: 'draft'
                    })
            })

            const _response = await response.json();
            if(response.ok) {
                console.log(_response.message);
            } else {
                console.log(_response.message);
            }
        } catch (error) {
            console.error('error saving draft', error)
        }
    }

    const togglePreview = () => {
        setPreviewOpen(!previewOpen)
    }

    return (
        <Box sx={{ padding: 2, marginBottom: 10 }}>
            <form onSubmit={handleSaveTemplate}>
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
                        {/*<Typography variant="overline" sx={{fontSize: '1rem', textAlign: 'center', marginBottom: 6}}>Fields</Typography>*/}
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
                        <Button variant='outlined' onClick={togglePreview}>
                            {previewOpen ? 'close preview' : 'preview form'}
                        </Button>
                        <Button variant='outlined' onClick={handleSaveDraft}>
                            save draft
                        </Button>

                        <Dialog open={previewOpen} onClose={togglePreview} fullWidth maxWidth='sm'>
                            <DialogTitle>Form Preview</DialogTitle>
                            <DialogContent>
                                <Typography variant='overline' sx={{textAlign: 'center'}}>{templateName || 'untitled form'}</Typography><br />
                                <Typography variant='overline' sx={{textAlign: 'center'}}>{templateDescription || 'no description provided'}</Typography>
                                <Divider sx={{marginBottom: 2}} />

                                <Stack spacing={2}>
                                { fields.map((field) => (
                                    <Box key={field.id} sx={{ marginBottom: 2}}>
                                        <Typography>{field.label || 'Unnamed Field'}</Typography>
                                        {field.type === 'text' && <TextField fullwidth disabled placeholder='Text Input' /> }
                                        {field.type === 'multiline' && (
                                            <TextField fullWidth multline placeholder='Multiline Input' rows={5} disabled />
                                        )}
                                        {field.type === 'number' &&  <TextField type='number' fullWidth disabled placeholder='Number Input'/>}
                                        {field.type === 'checkbox' && (
                                            <Stack direction='row' alignItems='center'>
                                            <Switch disabled />
                                                <Typography variant='overline'>Checkbox</Typography>
                                            </Stack>
                                        )}
                                        { field.type === 'dropdown' && (
                                            <Select fullWidth disabled variant='outlined'>
                                                {field.options.length > 0 ? (
                                                    field.options.map((option, idx) => (
                                                        <MenuItem key={idx} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                ))
                                                    ) : (<MenuItem >disabled>No Options </MenuItem>
                                                )}

                                            </Select>
                                        )}
                                    </Box>
                                ))}
                                </Stack>
                            </DialogContent>
                        </Dialog>
                    </Box>
                </Stack>
            </form>
        </Box>
    );
}
