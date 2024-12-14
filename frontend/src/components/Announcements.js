import { AnnouncementData, AnnouncementForm } from '../announcements/index'
import {Box } from "@mui/material";
import {useState} from "react";

export default function Announcements () {
    const [refreshAnnouncements, setRefreshAnnouncements] = useState(false)


    const toggleRefresh = () => setRefreshAnnouncements(prev => !prev);

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4, marginBottom: 10}}>

                <AnnouncementForm onAnnouncementCreated={toggleRefresh} />

                <AnnouncementData refreshTrigger={refreshAnnouncements} />
        </Box>
    );
};

