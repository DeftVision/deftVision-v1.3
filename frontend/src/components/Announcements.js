import { AnnouncementData, AnnouncementForm } from '../announcements/index'
import {Box } from "@mui/material";

export default function Announcements () {
    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>

                <AnnouncementForm />
                <AnnouncementData />

        </Box>
    );
};

