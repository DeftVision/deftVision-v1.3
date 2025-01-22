// /components/Documents.js
import { DocumentData, DocumentForm } from '../documents/index';
import { Box } from '@mui/material';
import { useState } from 'react';

export default function Documents() {
    const [refreshDocuments, setRefreshDocuments] = useState(false);

    const toggleRefresh = () => setRefreshDocuments((prev) => !prev);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                px: 2,
                mt: 4,
                mb: 10,
            }}
        >
            <DocumentForm onDocumentCreated={toggleRefresh} />
            <DocumentData refreshTrigger={refreshDocuments} />
        </Box>
    );
}
