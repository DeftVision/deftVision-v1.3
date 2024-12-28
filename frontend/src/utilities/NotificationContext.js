import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'info' });

    const showNotification = (message, severity = 'error') => {
        setNotification({ open: true, message, severity });
    };

    const handleClose = () => {
        setNotification({ ...notification, open: false });
    };

    return (
        <NotificationContext.Provider value={showNotification}>
            {children}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    return useContext(NotificationContext);
};
