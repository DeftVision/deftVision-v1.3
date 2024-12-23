import {
    Box,
    Button,
    AppBar,
    Toolbar,
    Divider,
    CssBaseline,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Typography,
    Drawer,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { House, Article, SpaceDashboard, Person, PeopleAlt, Campaign, Brightness7, Brightness4, Logout, Login } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../utilities/ThemeContext';
import { useAuth } from '../utilities/AuthContext';

export default function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleToggleDrawer = () => setMobileOpen((prevState) => !prevState);

    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout(navigate);
        } else {
            navigate('/login', { replace: true });
        }
    };


    const drawerLinks = [
        { label: 'Hom', path: '/', icon: <House />, roles: ['Admin', 'User', 'Shopper'] },
        { label: 'Use', path: '/users', icon: <Person />, roles: ['Admin'] },
        { label: 'Sho', path: '/shoppers', icon: <Person />, roles: ['Admin', 'User', 'Shopper'] },
        { label: 'Emp', path: '/employees', icon: <PeopleAlt />, roles: ['Admin', 'User'] },
        { label: 'VAn', path: '/announcements', icon: <Campaign />, roles: ['Admin', 'User', 'Shopper'] },
        { label: 'MAn', path: '/manage-announcements', icon: <Campaign />, roles: ['Admin'] },
        { label: 'Doc', path: '/documents', icon: <Article />, roles: ['Admin', 'User'] },
        { label: 'MDo', path: '/manage-documents', icons: <Article/>, roles: ['Admin'] },
        { label: 'Das', path: '/dashboards', icon: <SpaceDashboard />, roles: ['Admin', 'User', 'Shopper'] },

    ];

    const filteredLinks = drawerLinks.filter(link => link.roles.includes(user?.role));

    const drawer = (
        <Box onClick={handleToggleDrawer} sx={{ textAlign: 'center', paddingTop: 2 }}>
            <Typography variant="overline" sx={{ fontSize: '.75rem' }}>version 1.3</Typography>
            <Divider sx={{ paddingTop: 1 }} />
            <List>
                {filteredLinks.map(link => (
                    <ListItem disablePadding key={link.path}>
                        <ListItemButton sx={{ textAlign: 'start' }}>
                            <Link
                                to={link.path}
                                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
                            >
                                <IconButton>{link.icon}</IconButton>
                                <ListItemText primary={link.label} sx={{ marginLeft: 2 }} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton sx={{ textAlign: 'start' }} onClick={handleAuthAction}>
                        <IconButton>{isAuthenticated ? <Logout /> : <Login />}</IconButton>
                        <ListItemText primary={isAuthenticated ? 'Logout' : 'Login'} sx={{ marginLeft: 2 }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleToggleDrawer}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="overline" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        version 1.3
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {filteredLinks.map(link => (
                            <Button
                                key={link.path}
                                variant="text"
                                color="inherit"
                                sx={{ textDecoration: 'none' }}
                            >
                                <Link to={link.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {link.label}
                                </Link>
                            </Button>
                        ))}
                        <Button variant="text" color="inherit" onClick={handleAuthAction}>
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Button>
                    </Box>
                    <Button color="inherit" onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </Button>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleToggleDrawer}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
        </Box>
    );
}
