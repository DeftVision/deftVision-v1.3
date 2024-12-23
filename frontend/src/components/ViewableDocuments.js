import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, CircularProgress } from '@mui/material'



export default function ViewableDocuments () {
    const [documents, setDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function getDocuments() {
            try {
                const token = sessionStorage.getItem('token');
                console.log('token received from sessionStorage:', token);

                if (!token) {
                    error('Token Missing in session Storage')
                    setError('Authorization token is missing')
                    return;
                }

                const response = await fetch('http://localhost:8005/api/document/audience', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })

                const _response = await response.json();

                if (response.ok) {
                    setDocuments(_response.documents)
                    console.log('fetched documents')
                } else {
                    setError(_response.message || 'Failed to fetch documents');
                }
            } catch (error) {
                console.error('An error occurred while fetching documents', error)
            } finally {
                setLoading(false);
            }
        }
        getDocuments();
    }, [])

    if(loading) return <CircularProgress />

    return (
        <Box sx={{ padding: 2}}>
            { documents.length > 0 ? (
                documents.map((document) => (
                    <Card key={document._id} sx={{ marginBottom: 2 }}>
                        <CardHeader
                            title={document.title}
                            // subheader={`Published on: ${new Date(documents.createdAt).toLocaleDateString()}`}
                        />
                        <CardContent>
                            <Typography variant='body2' color='textSecondary'>
                                {document.content}
                            </Typography>
                        </CardContent>

                    </Card>
                ))
            ) : (
                <Typography variant='body2'>
                    No documents at this time
                </Typography>
            )}
        </Box>
    );
}