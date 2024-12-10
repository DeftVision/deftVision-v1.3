import {Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper} from '@mui/material'
import { useState, useEffect } from 'react'
import { DoNotDisturb, CheckCircleOutline } from '@mui/icons-material'
export default function DocumentData () {
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        async function getDocuments() {
            try {
                const response = await fetch('http://localhost:8005/api/document/', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                })

                const _response = await response.json();

                if (response.ok && _response.documents) {
                    setDocuments(_response.documents);
                } else {
                    console.error('error fetching document data')
                }

            } catch (error) {
                console.error('failed to get document data')
            }
        }

        getDocuments();
    }, []);

    const handlePublishedStatus = async (documentId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/document/${documentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            })

            if(response.ok) {
                const updatedDocuments = documents.map((document) =>
                    document._id === documentId
                        ? { ...document, isPublished: !currentStatus }
                        : document
                );
                setDocuments(updatedDocuments);
            } else {
                console.error('failed to update announcement status')
            }
        } catch (error)  {
            console.error('error updating announcement status', error)
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
                <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Authored</TableCell>
                                    <TableCell>Published</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {documents.map((document) => (
                                    <TableRow key={document._id}>
                                        <TableCell>{document.category}</TableCell>
                                        <TableCell>{document.title}</TableCell>
                                        <TableCell>{document.uploadedBy}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handlePublishedStatus(document._id, document.isPublished)}>
                                                {document.isPublished ? (
                                                    <CheckCircleOutline sx={{color: 'dodgerblue'}}/>
                                                ) : (
                                                    <DoNotDisturb sx={{color: '#aaa'}}/>
                                                )}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Paper>

        </Box>
    );
};

