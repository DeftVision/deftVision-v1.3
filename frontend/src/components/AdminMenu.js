import { Box, Typography, Card, CardContent, CardHeader, CardActions,  } from '@mui/material'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Announcements, Documents,  Employees, FormTemplate, Users } from './index'




export default function AdminMenu() {
    return (
        <Box>
            <Typography>Admin Menu For Only Admins</Typography>
        </Box>
    );
}