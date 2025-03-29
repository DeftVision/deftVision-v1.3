// frontend/src/utilities/FormDetails.js

import { useTheme} from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery'
import FormDetailsMobile from './FormDetailsMobile';
import FormDetailsDesktop from './FormDetailsDesktop'

export default function FormDetails ({ shopper, role, onClose }) {

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    
    return isMobile
        ? <FormDetailsMobile shopper={shopper} role={role} onClose={onClose} />
        : <FormDetailsDesktop shopper={shopper} role={role} onClose={onClose}/>

}


