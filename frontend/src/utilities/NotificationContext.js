import React, { createContext, useContext, useState, useCallback } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [notification, setNotification] = useState({ message: '', severity: 'info' });

    const showNotification = useCallback((message, severity = 'info') => {
        setNotification({ message, severity });
        setSnackbarOpen(true);
    }, []);

    const handleClose = () => setSnackbarOpen(false);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                sx={{ '& .MuiSnackbar-root': {} }} // Doesn't remove ownerState
            >

            <Alert
                    onClose={handleClose}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ alignItems: "center" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
