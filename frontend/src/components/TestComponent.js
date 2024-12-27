import { Box, Table, TableBody, FormControl, TableHead, TableContainer, TableCell, TableRow, TablePagination, TableSortLabel, OutlinedInput, InputAdornment, IconButton, Paper } from '@mui/material'
import {CheckCircleOutline, DoNotDisturb, Search} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'


export default function TestComponent ( {refreshTrigger} ) {
    const theme = useTheme();
    const [documents, setDocuments] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'})
    const [error, setError] = useState('');

    useEffect(() => {
        async function getdocs() {
            try {
                const response = await fetch('http://localhost:8005/api/document/', {
                    method: 'GET',
                    headers: { 'Content-Type' : 'application/json'}
                })

                const _response = await response.json();

                if(response.ok && _response.documents) {
                    setDocuments(_response.documents);
                } else {
                    setError('error fetching doc data')
                }

            } catch (error) {
                setError('failed to get doc data')
            }
        }
        getdocs();
    }, [refreshTrigger]);

    // search input
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    }

    // sort columns
    const handleSort = (key) => {
        let direction = 'asc';
        if(sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({key, direction})
    }

    // sort logic
    const sortedDocuments = [...documents].sort((a,b) => {
        if(sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

    const filteredDocuments = sortedDocuments.filter((document) => {
        return document.title.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedDocuments = filteredDocuments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

    const handlePublishedStatus = async (documentId, currentStatus) =>  {
        try {
            const response = await fetch(`http://localhost:8005/api/document/status/${documentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isPublished: !currentStatus }),
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
                setError('failed to update announcement status')
            }
        } catch (error)  {
            setError('error updating announcement status')
        }
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Box sx={{width: '50%', justifyContent: 'center', margin: 'auto', paddingTop: 5}}>
                <Box>
                    <FormControl>
                        <OutlinedInput
                            id='outlined-adornment-search'
                            startAdornment={<InputAdornment position='start'><Search /></InputAdornment>}
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </FormControl>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'isPublished'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('isPublished')}
                                    >
                                        Published
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'title'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'priority'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('priority')}
                                    >
                                        Category
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortConfig.key === 'author'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('author')}
                                    >
                                        Audience
                                    </TableSortLabel>
                                </TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedDocuments.map((document) => (
                                <TableRow
                                    key={document._id}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: theme.palette.action.hover,
                                            color: theme.palette.mode === 'dark' ? '#000' : '#fff',
                                            cursor: 'default',
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <IconButton onClick={() => handlePublishedStatus(document._id, document.isPublished)}>
                                            {document.isPublished ? (
                                                <CheckCircleOutline sx={{color: 'dodgerblue'}}/>
                                            ) : (
                                                <DoNotDisturb sx={{color: '#aaa'}}/>
                                            )}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell>{document.title}</TableCell>
                                    <TableCell>{document.category}</TableCell>
                                    <TableCell>{document.audiences}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component='div'
                    count={document.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
};

