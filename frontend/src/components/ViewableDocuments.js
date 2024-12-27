import { DocumentData } from "../documents/index";
import { Box } from '@mui/material'

export default function ViewableDocuments () {

    return (
        <Box
            sx={{
                width: '100%',
                overflowX: 'auto',
                padding: 2
            }}
        >
            <DocumentData showPublishedColumn={false} showEditColumn={false} showOnlyPublished={true}/>
        </Box>
    );
}