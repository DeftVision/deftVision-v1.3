import { useState } from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Input,
    Skeleton,
} from '@mui/material'





export default function EditDocumentModal({ open, onClose, document, onSave }) {
    const [formData, setFormData] = useState(document || {})
    const [newFile, setNewFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }



    const handleFileChange = (e) => {
        setNewFile(e.target.files[0])
    }

    const handleSave = async () => {
        setIsLoading(true)
        await onSave(formData, newFile);
        onClose();
        setIsLoading(false)
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogContent>
                {isLoading ? (
                    <>
                        <Skeleton variant='text' height={40} />
                        <Skeleton variant='text' height={40} />
                        <Skeleton variant='rectangular' height={60} sx={{ mt: 2}} />

                    </>
                ) : (
                    <>
                        <TextField
                            fullWidth
                            label='Title'
                            name='title'
                            value={formData.title || ''}
                            onChange={handleChange}
                            margin='normal'
                        />

                        <TextField
                            fullWidth
                            label='Cateogy'
                            name='category'
                            value={formData.category || ''}
                            onChange={handleChange}
                            margin='normal'
                        />

                        <Box mt={2}>
                            <Input
                                type='file'
                                onChange={handleFileChange}
                            />
                        </Box>
                    </>
                )}

            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={onClose}>Cancel</Button>
                <Button variant='outlined' onClick={handleSave} color='primary'>
                    Save
                </Button>
            </DialogActions>

        </Dialog>
    );



}