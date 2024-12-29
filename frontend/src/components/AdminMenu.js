import {
    Box,
    ButtonBase,
    Card,
    CardContent,
    Typography,
} from '@mui/material';
import { Article, Campaign, PeopleAlt, Grading, DynamicForm } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import React from 'react'
export default function AdminMenu() {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';

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
            {[
                {
                    title: 'Announcements',
                    icon: <Campaign />,
                    link: '/manage-announcements',
                },
                {
                    title: 'Documents',
                    icon: <Article />,
                    link: '/manage-documents',
                },
                {
                    title: 'Users',
                    icon: <PeopleAlt />,
                    link: '/users',
                },
                {
                    title: 'Shopper Visit',
                    icon: <Grading />,
                    link: '/shoppers',
                },
                {
                    title: 'Form Templates',
                    icon: <DynamicForm />,
                    link: '#',
                },
            ].map(({ title, icon, link }) => (
                <ButtonBase
                    key={title}
                    component={Link}
                    to={link}
                    sx={{
                        width: { xs: '100%', sm: '250px' }, 
                        height: '150px',
                        textAlign: 'center',
                        borderRadius: '8px',
                    }}
                >
                    <Card
                        sx={{
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            boxShadow: 3,
                            transition: 'transform 0.3s, box-shadow 0.3s, background-color 0.3s',
                            backgroundColor: isDarkMode
                                ? 'rgba(255, 255, 255, 0.05)' // Subtle white tint for dark mode
                                : 'rgba(0, 0, 0, 0.05)', // Subtle black tint for light mode
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: 6,
                                backgroundColor: isDarkMode
                                    ? 'rgba(255, 255, 255, 0.2)' // More white tint for dark mode
                                    : 'rgba(0, 0, 0, 0.2)', // More black tint for light mode
                            },
                            color: isDarkMode ? 'white' : 'black',
                        }}
                    >
                        {React.cloneElement(icon, {
                            sx: {
                                position: 'absolute',
                                fontSize: '8rem',
                                color: isDarkMode
                                    ? 'rgba(255, 255, 255, 0.1)'
                                    : 'rgba(0, 0, 0, 0.1)',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 1,
                                transition: 'transform 0.3s',
                                '&:hover': {
                                    transform: 'translate(-50%, -50%) scale(1.1)',
                                },
                            },
                        })}
                        <CardContent sx={{ zIndex: 2 }}>
                            <Typography variant="h6">{title}</Typography>
                        </CardContent>
                    </Card>
                </ButtonBase>
            ))}
        </Box>
    );
}
