import {Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper} from '@mui/material'
import { Assignment } from '@mui/icons-material'
import { useState, useEffect } from 'react'

export default function ShopperData () {
    const [shoppers, setShoppers] = useState([])

    useEffect(() => {
        async function getShopperVisits() {
            try {
                const response = await fetch('http://localhost:8005/api/shopper/', {
                    method: 'GET',
                    headers: { 'Content-Type' : 'application/json'}
                })

                const _response = await response.json();

                if(response.ok && _response.shoppers) {
                    setShoppers(_response.shoppers);
                } else {
                    console.error('error fetching shopper data')
                }

            } catch (error) {
                console.error('failed to get shopper data')
            }
        }
        getShopperVisits();
    }, []);

    const handlePublishedStatus = async (shopperId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/shopper/status${shopperId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            })

            if(response.ok) {
                const updatedShoppers = shoppers.map((shopper) =>
                    shopper._id === shopperId
                        ? { ...shopper, isPublished: !currentStatus }
                        : shopper
                );
                setShoppers(updatedShoppers);
            } else {
                console.error('failed to update shopper status')
            }
        } catch (error)  {
            console.error('error updating shopper status', error)
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            {/*<Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>*/}
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Final Score</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shoppers.map((shopper) => (
                                    <TableRow key={shopper._id}>
                                        <TableCell>{shopper.dateTime}</TableCell>
                                        <TableCell>{shopper.location}</TableCell>
                                        <TableCell>{shopper.finalScore}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            {/*</Paper>*/}

        </Box>
    );
};

