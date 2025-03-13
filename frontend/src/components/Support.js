// /components/Support.js
import { Box } from '@mui/material';
import { SupportData, SupportForm } from '../support/index';
import { useState } from 'react';

export default function Support() {
    const [refreshSupportTickets, setRefreshSupportTickets] = useState(false);

    const toggleRefresh = () => setRefreshSupportTickets((prev) => !prev);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                justifyContent: 'center',
                alignItems: 'flex-start',
                px: 2,
                py: 4,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', md: '45%' },
                }}
            >
                <SupportForm onSupportTicketCreated={toggleRefresh} />
            </Box>
            <Box
                sx={{
                    flex: 1,
                    maxWidth: { xs: '100%', md: '45%' },
                }}
            >
                <SupportData refreshTrigger={refreshSupportTickets} />
            </Box>
        </Box>
    );
}
