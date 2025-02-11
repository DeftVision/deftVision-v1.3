// /components/Documents.js (Optimized for Performance & Clean Code)
import { useState } from "react";
import { Box } from "@mui/material";
import {DocumentForm, DocumentData} from "../documents/index";


export default function Documents() {
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const handleDocumentUpdated = () => setRefreshTrigger(prev => !prev);
    const handleEditDocument = (doc) => setSelectedDocument(doc);

    return (
        <Box sx={{ px: 2, mt: 4 }}>
            <DocumentForm onDocumentUpdated={handleDocumentUpdated} editData={selectedDocument} />
            <DocumentData refreshTrigger={refreshTrigger} onEditDocument={handleEditDocument} />
        </Box>
    );
}


