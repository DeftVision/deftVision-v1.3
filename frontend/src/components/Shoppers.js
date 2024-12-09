import { ShopperData, ShopperForm } from '../shoppers/index'
import { Box } from '@mui/material'

export default function Shoppers() {
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
            <ShopperForm />
            <ShopperData />
        </Box>
    )
}