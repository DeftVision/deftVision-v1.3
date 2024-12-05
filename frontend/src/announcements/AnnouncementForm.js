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
    FormControlLabel
} from '@mui/material'
import React, { useState } from 'react'


const form_fields = {
    title: '',
    content: '',
    author: '',
    audiences: '',
    priorities: '',
    publish: false,
}


const AnnouncementForm = () => {
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
        <Box>
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
                />
                <TextField
                    type='text'
                    label='Content'
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.content}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            content: e.target.value
                        })
                    }}
                />
                <TextField
                    type='text'
                    label='Author'
                    fullWidth
                    value={formData.author}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            author: e.target.value
                        })

                    }}
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
                            checked={formData.publish}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    publish: e.target.checked
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
    );
};

export default AnnouncementForm;