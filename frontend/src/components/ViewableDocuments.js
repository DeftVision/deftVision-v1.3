// /components/ViewableDocuments.js
import { DocumentData } from '../documents/index';
import { Box } from '@mui/material';

export default function ViewableDocuments() {
    return (
        <Box sx={{ width: '100%', px: 2, py: 4 }}>
            <DocumentData showPublishedColumn={false} showEditColumn={false} showOnlyPublished />
        </Box>
    );
}
