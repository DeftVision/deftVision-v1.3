/*// /components/Shoppers.js
import { ShopperData, ShopperForm } from '../shoppers/index';
import { Box } from '@mui/material';

export default function Shoppers() {
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
                    flex: '1',
                    maxWidth: { xs: '100%', md: '45%' },
                }}
            >
                <ShopperForm />
            </Box>
            <Box
                sx={{
                    flex: '1',
                    maxWidth: { xs: '100%', md: '45%' },
                }}
            >
                <ShopperData />
            </Box>
        </Box>
    );
}*/

// /components/Shoppers.js
import { ShopperData, ShopperForm } from '../shoppers/index';
import { Box } from '@mui/material';

export default function Shoppers() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', px: 2, py: 4 }}>
            <ShopperForm />
            <ShopperData />
        </Box>
    );
}

