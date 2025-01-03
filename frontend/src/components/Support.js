import { Box, Typography } from '@mui/material'
import SupportForm from '../support/SupportForm'




export default function Support() {



    return(
        <Box>
            <Typography variant='overline' sx={{ fontSize: '2rem'}}>Support</Typography>
            <SupportForm />
        </Box>
    );
}