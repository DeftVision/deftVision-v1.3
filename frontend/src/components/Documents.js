import { DocumentData, DocumentForm } from '../documents/index'
import { Box } from '@mui/material'

export default function Documents () {
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <DocumentForm />
            <DocumentData />
        </Box>
    );
};