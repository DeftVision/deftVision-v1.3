import { Box, Typography, Stack, Button } from '@mui/material'
import { Link } from 'react-router-dom'
export default function Unauthorized () {
    return (
        <Box sx={{ display: 'flex', textAlign: 'center'}}>
            <Stack direction='column' spacing={2}>
                <Typography variant="h4" color='error'>Unauthorized</Typography>
                <Typography variant='overline' color='error'>you do not have permissions to view this page</Typography>
                <Button variant="outlined" component={Link} to='/login'>Go back</Button>
            </Stack>
        </Box>
    );
}