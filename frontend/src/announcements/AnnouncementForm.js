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
    Paper
} from '@mui/material'
import React, { useState } from 'react'


const form_fields = {
    title: '',
    content: '',
    author:
        `${JSON.parse(sessionStorage.getItem('user'))?.firstName || ''} `+
        `${JSON.parse(sessionStorage.getItem('user'))?.lastName || ''}`,
    audiences: '',
    priorities: '',
    isPublished: false,
}


const AnnouncementForm = ({ onAnnouncementCreated }) => {
    const [formData, setFormData] = useState(form_fields)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8005/api/announcement', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const _response = await response.json();
            if(response.ok && _response.announcement) {
                setFormData(formData)
                onAnnouncementCreated();
            } else {
                console.log('Error saving form',  _response.message);
            }
            console.log(_response.announcements)
        } catch (error) {
            console.log('Error submitting form:', error);
        }
        console.log(formData)
    }


    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
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
                            <InputLabel>Priority</InputLabel>
                            <Select
                                label='Priority'
                                variant='outlined'
                                value={formData.priorities || '' }
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        priorities: e.target.value
                                    })
                                }}
                                sx={{width: '500px'}}
                            >
                                {priorities.map((priority) => (
                                    <MenuItem key={priority} value={priority}>
                                        {priority}
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
            </Paper>
        </Box>
    );
};

export default AnnouncementForm;