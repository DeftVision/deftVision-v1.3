import { TableSortLabel, FormControl, TablePagination, OutlinedInput, InputAdornment, Box, Table, TableBody, TableHead, TableContainer, TableCell, TableRow, IconButton, Paper} from '@mui/material'
import { useState, useEffect } from 'react'
import { DoNotDisturb, CheckCircleOutline, Search } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'

export default function DocumentData () {
    const theme = useTheme();
    const [documents, setDocuments] = useState([])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [searchQuery, setSearchQuery] = useState('')
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});


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
        return document.category.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const displayedDocuments = filteredDocuments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value)
        setPage(0);
    }

    return (
        <Box width='100%' sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 4}}>
            <Paper elevation={16} sx={{padding: 5, maxWidth: '1200px', width: '90%'}}>
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
                                            active={sortConfig.key === 'category'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('category')}
                                        >
                                            Category
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
                                            active={sortConfig.key === 'author'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('author')}
                                        >
                                            Authored
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'isPublished'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('isPublished')}
                                        >
                                            Published
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
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        component='div'
                        count={documents.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>
            </Paper>

        </Box>
    );
};

