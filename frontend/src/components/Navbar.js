// /components/Navbar.js
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
import {
    House, Article, AdminPanelSettings, SpaceDashboard, PeopleAlt, Campaign, Brightness7, Brightness4, Logout, Login
} from '@mui/icons-material';
import HelpIcon from '@mui/icons-material/Help';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../utilities/ThemeContext';
import { useAuth } from '../utilities/AuthContext';

export default function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleToggleDrawer = () => setMobileOpen((prev) => !prev);
    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout(navigate);
        } else {
            navigate('/login', { replace: true });
        }
    };

    const drawerLinks = [
        { label: 'Home', path: '/', icon: <House />, roles: ['Admin', 'User', 'Shopper'] },
        { label: 'Announcements', path: '/announcements', icon: <Campaign />, roles: ['Admin', 'User', 'Shopper'] },
        { label: 'Documents', path: '/documents', icon: <Article />, roles: ['Admin', 'User'] },
        { label: 'Employees', path: '/employees', icon: <PeopleAlt />, roles: ['Admin', 'User'] },
        { label: 'Dashboard', path: '/dashboards', icon: <SpaceDashboard />, roles: ['Admin', 'User', 'Shopper'] },
        { label: 'Admin', path: '/admin', icon: <AdminPanelSettings />, roles: ['Admin'] },
        { label: 'Support', path: '/support', icon: <HelpIcon />, roles: ['Admin', 'Shopper', 'User'] },
    ];

    const filteredLinks = drawerLinks.filter(link => link.roles.includes(user?.role));

    const drawer = (
        <Box onClick={handleToggleDrawer} sx={{ textAlign: 'center', paddingTop: 2 }}>
            <Typography variant="overline" sx={{ fontSize: '.9rem', fontWeight: 600 }}>version 1.3</Typography>
            <Divider sx={{ my: 2 }} />
            <List>
                {filteredLinks.map(link => (
                    <ListItem disablePadding key={link.path}>
                        <ListItemButton>
                            <Link
                                to={link.path}
                                style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', width: '100%' }}
                            >
                                <IconButton>{link.icon}</IconButton>
                                <ListItemText primary={link.label} sx={{ ml: 2 }} />
                            </Link>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleAuthAction}>
                        <IconButton>{isAuthenticated ? <Logout /> : <Login />}</IconButton>
                        <ListItemText primary={isAuthenticated ? 'Logout' : 'Login'} sx={{ ml: 2 }} />
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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
                        beta 1.3
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
                        {filteredLinks.map(link => (
                            <Button
                                key={link.path}
                                sx={{ color: 'inherit', textTransform: 'none' }}
                                component={Link}
                                to={link.path}
                            >
                                {link.label}
                            </Button>
                        ))}
                        <Button sx={{ color: 'inherit', textTransform: 'none' }} onClick={handleAuthAction}>
                            {isAuthenticated ? 'Logout' : 'Login'}
                        </Button>
                    </Box>
                    <IconButton color="inherit" onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <nav>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleToggleDrawer}
                    ModalProps={{ keepMounted: true }}
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
