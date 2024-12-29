import { Article, Campaign, DynamicForm, Grading, PeopleAlt } from '@mui/icons-material';
import { Avatar, Box } from "@mui/material";
import CardTemplate from './CardTemplate'

export default function AdminMenu() {
    const menuItems = [
        {
            title: 'Announcements',
            icon: <Campaign/>,
            link: '/manage-announcements',
        },
        {
            title: 'Documents',
            icon: <Article/>,
            link: '/manage-documents',
        },
        {
            title: 'Users',
            icon: <PeopleAlt/>,
            link: '/users',
        },
        {
            title: 'Shopper Visit',
            icon: <Grading/>,
            link: '/shoppers',
        },
        {
            title: 'Form Templates',
            icon: <DynamicForm/>,
            link: '#',
        },
    ];

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 2,
                padding: 2,
            }}
        >
            {menuItems.map(({title, icon, link} ) => (
                <CardTemplate
                    key={title}
                    title={title}
                    avatar={
                        <Avatar
                            sx={{
                                backgroundColor: 'primary.main',
                                width: 40,
                                height: 40,
                            }}
                        >
                            { icon }
                        </Avatar>
                    }
                    hoverEffect
                    onClick={() => {window.location.href = link}}
                />
            ))}
        </Box>
    );
}
