import { AnnouncementForm } from '../announcements/index'
import { Box } from "@mui/material";
import {useState} from "react";
import ViewableAnnouncements from '../components/ViewableAnnouncements'

export default function Announcements () {
    const [refreshAnnouncements, setRefreshAnnouncements] = useState(false)


    const toggleRefresh = () => setRefreshAnnouncements(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>
                <AnnouncementForm onAnnouncementCreated={toggleRefresh} />
                <ViewableAnnouncements refreshTrigger={refreshAnnouncements} />
        </Box>
    );
};

