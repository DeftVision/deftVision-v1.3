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
import { useState } from 'react'


const form_fields = {
    title: '',
    category: '',
    uploadedBy: '',
    uniqueName: '',
    downloadUrl: '',
    access: '',
}

export default function DocumentForm () {
    const [formData, setFormData] = useState(form_fields)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8005/api/document', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const _response = await response.json();
            if(response.ok && _response.documents) {
                setFormData(formData)
            } else {
                console.log('Error saving document',  _response.message);
            }
            console.log(_response.documents)
        } catch (error) {
            console.log('Error submitting documents:', error);
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
                                label='Category'
                                value={formData.category}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        category: e.target.value
                                    })
                                }}
                            />
                            <input
                                type='hidden'
                                value={formData.uniqueName}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        uniqueName: e.target.value
                                    })

                                }}
                            />
                            <input
                                type='hidden'
                                value={formData.downloadUrl}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        downloadUrl: e.target.value
                                    })

                                }}
                            />
                            <TextField
                                type='text'
                                label='Access'
                                value={formData.access}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        access: e.target.value
                                    })
                                }}
                            />
                            <input
                                type='hidden'
                                value={formData.uploadedBy}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        uploadedBy: e.target.value
                                    })
                                }}
                            />
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

