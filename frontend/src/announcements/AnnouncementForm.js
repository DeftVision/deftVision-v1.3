import { audiences, priorities } from '../utilities/index'
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    Stack,
    Switch,
    FormControl,
    InputLabel,
    FormControlLabel,
} from '@mui/material'
import { useState } from 'react'
import { useNotification } from '../utilities/NotificationContext'


const form_fields = {
    title: '',
    content: '',
    author:
        `${JSON.parse(sessionStorage.getItem('user'))?.firstName || ''} `+
        `${JSON.parse(sessionStorage.getItem('user'))?.lastName || ''}`,
    audience: [],
    priority: '',
    isPublished: false,
}


const AnnouncementForm = ({ onAnnouncementCreated }) => {
    const [formData, setFormData] = useState(form_fields)
    const { showNotification } = useNotification();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            content: formData.content,
            author: formData.author,
            priority: formData.priority,
            audience: Array.isArray(formData.audience) ? formData.audience : [formData.audience],
            isPublished: formData.isPublished,
        }
        console.log("Form Data Submitted:", formData);

        try {
            const response = await fetch('http://localhost:8005/api/announcement', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const _response = await response.json();

            if(response.ok && _response.announcement) {
                setFormData(formData)
                onAnnouncementCreated();
                showNotification('Announcement created successfully', 'success');
            } else {
                console.log('Error saving form',  _response.message);
                showNotification('Error saving form', 'error')
            }
        } catch (error) {
            console.log('Error submitting form:', error);
            showNotification('Error saving form', 'error')
        }

    }


    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                <form onSubmit={handleSubmit}>
                <Stack direction='column' spacing={3}>
                <TextField
                    type='text'
                    label='Title'
                    fullWidth
                    value={formData.title}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            title: e.target.value
                        })
                    }}
                    sx={{width: '500px'}}
                />
                <TextField
                    type='text'
                    label='Content'
                    multiline
                    rows={3}
                    value={formData.content}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            content: e.target.value
                        })
                    }}
                    sx={{width: '500px'}}
                />
                <input
                    type='hidden'
                    value={formData.author}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            author: e.target.value
                        })
                    }}
                    // sx={{width: '500px'}}
                />
                    <FormControl>
                        <InputLabel>Audience</InputLabel>
                        <Select
                            label='Audience'
                            variant='outlined'
                            value={formData.audiences || '' }
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    audiences: e.target.value
                                })
                            }}
                            sx={{width: '500px'}}
                        >
                            {audiences.map((audience) => (
                                <MenuItem key={audience} value={audience}>
                                    {audience}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputLabel>Audience</InputLabel>
                        <Select
                            label="Audience"
                            variant="outlined"
                            value={formData.audience || []}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    audience: Array.isArray(e.target.value) ? e.target.value : [e.target.value],
                                });
                            }}
                            multiple // Allow multiple selections if necessary
                            sx={{ width: '500px' }}
                        >
                            {audiences.map((audience) => (
                                <MenuItem key={audience} value={audience}>
                                    {audience}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControlLabel
                     control={
                        <Switch
                            name='publish'
                            checked={formData.isPublished}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    isPublished: e.target.checked
                                })
                            }}

                        />
                    }
                     label='Publish'
                    />
                    <Button variant='outlined' type='submit'>save</Button>
                </Stack>
            </form>
                </Box>
        </Box>
    );
};

export default AnnouncementForm;