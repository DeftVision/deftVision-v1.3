import { Box, Typography } from '@mui/material'
import SupportForm from '../support/SupportForm'



export default function Support() {
    return(
        <Box sx={{ justifyContent: 'center', textAlign: 'center'}}>
            <Typography variant='overline' sx={{ fontSize: '1rem', marginBottom: 10 }}>New Support Ticket</Typography>
            <Box sx={{ marginTop: 5 }} >
                <SupportForm  />
            </Box>
        </Box>
    );
}