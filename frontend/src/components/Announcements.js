import { AnnouncementData, AnnouncementForm } from '../announcements/index'
import {Box, Stack} from "@mui/material";

export default function Announcements () {
    return (
        <Box>
            <Stack direction='column' spacing={5}>
                <AnnouncementForm />
                <AnnouncementData />
            </Stack>
        </Box>
    );
};

