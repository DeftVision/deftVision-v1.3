import {Box, Stack, Typography} from "@mui/material";
import { FinalScore, Ranking, ShopperScore } from '../dashboards/index'

export default function Dashboards () {
    return (
        <Box sx={{ display: 'flex', marginBottom: 10, justifyContent: 'center', textAlign: 'center' }}>
            <Stack direction='column' spacing={3}>
            <Typography variant='overline' sx={{fontSize: '1rem'}}>
                Welcome to your Dashboard
            </Typography>
                <FinalScore />
                <Ranking />
                <ShopperScore />
            </Stack>
        </Box>
    );
}