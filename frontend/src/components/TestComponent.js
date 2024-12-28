import React from 'react';
import Button from '@mui/material/Button';
import { useNotification } from '../utilities/NotificationContext';

const ExampleComponent = () => {
    const { showNotification } = useNotification();

    const handleSuccess = () => showNotification('This is a success message!', 'success');
    const handleError = () => showNotification('An error occurred!', 'error');

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleSuccess}>
                Show Success
            </Button>
            <Button variant="contained" color="secondary" onClick={handleError}>
                Show Error
            </Button>
        </div>
    );
};

export default ExampleComponent;
