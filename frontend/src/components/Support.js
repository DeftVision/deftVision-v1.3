import {Box, Typography} from '@mui/material'
import {SupportData, SupportForm} from '../support/index'
import {useState} from "react";


export default function Support() {
    const [refreshSupportTickets, setRefreshSupportTickets] = useState(false)


    const toggleRefresh = () => setRefreshSupportTickets(prev => !prev);
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
                <SupportForm onSupportTicketCreated={toggleRefresh} />
                <SupportData refreshTrigger={refreshSupportTickets} />
        </Box>
    );
}