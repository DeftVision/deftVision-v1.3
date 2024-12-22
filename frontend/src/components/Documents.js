import { DocumentData, DocumentForm } from '../documents/index'
import { Box } from '@mui/material'
import { useState } from 'react'

export default function Documents () {
    const [refreshDocuments, setRefreshDocuments] = useState(false)

    const toggleRefresh = () => setRefreshDocuments(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <DocumentForm onDocumentCreated={toggleRefresh} />
            <DocumentData refreshTrigger={refreshDocuments} />
        </Box>
    );
};