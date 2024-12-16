import {
    TableSortLabel,
    FormControl,
    TablePagination,
    OutlinedInput,
    InputAdornment,
    Box,
    Table,
    TableBody,
    TableHead,
    TableContainer,
    TableCell,
    TableRow,
    IconButton,
    Paper
} from '@mui/material';
import { useState, useEffect } from 'react';
import { DoNotDisturb, CheckCircleOutline, Search } from '@mui/icons-material';
import { PictureAsPdf, Description, Image, VideoLibrary } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

export default function DocumentData() {
    const theme = useTheme();
    const [documents, setDocuments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

    useEffect(() => {
        async function getDocuments() {
            try {
                const response = await fetch('http://localhost:8005/api/document/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const _response = await response.json();

                if (response.ok && _response.documents) {
                    setDocuments(_response.documents);
                } else {
                    console.error('Error fetching document data');
                }
            } catch (error) {
                console.error('Failed to get document data', error);
            }
        }

        getDocuments();
    }, []);

    const handlePublishedStatus = async (documentId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:8005/api/document/${documentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isActive: !currentStatus }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const updatedDocuments = documents.map((document) =>
                    document._id === documentId
                        ? { ...document, isPublished: !currentStatus }
                        : document
                );
                setDocuments(updatedDocuments);
            } else {
                console.error('Failed to update document status');
            }
        } catch (error) {
            console.error('Error updating document status', error);
        }
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedDocuments = [...documents].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const filteredDocuments = sortedDocuments.filter((document) =>
        document.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedDocuments = filteredDocuments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const handleChangePage = (e, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(+e.target.value);
        setPage(0);
    };

    const handleOpenFile = (url) => {
        window.open(url, '_blank');
    };

    // Map file extensions to icons
    const fileIcons = {
        pdf: <PictureAsPdf color="error" />,
        docx: <Description color="primary" />,
        xlsx: <Description color="secondary" />,
        jpg: <Image color="action" />,
        jpeg: <Image color="action" />,
        png: <Image color="action" />,
        txt: <Description color="inherit" />,
        mp4: <VideoLibrary color="secondary" />,
    };

    return (
        <Box
            width="100%"
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                marginTop: 4
            }}
        >
            <Box
                sx={{
                    width: '80%',
                    justifyContent: 'center',
                    margin: 'auto',
                    paddingTop: 5
                }}
            >
                <Box>
                    <FormControl>
                        <OutlinedInput
                            id="outlined-adornment-search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            }
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
                                <TableCell>File Type</TableCell>
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
                            {displayedDocuments.map((document) => {
                                const fileExtension = document.uniqueName
                                    .split('.')
                                    .pop()
                                    .toLowerCase();

                                return (
                                    <TableRow
                                        key={document._id}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor:
                                                theme.palette.action.hover,
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <TableCell>{document.category}</TableCell>
                                        <TableCell>{document.title}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenFile(document.downloadUrl)
                                                }
                                            >
                                                {fileIcons[fileExtension] || (
                                                    <Description />
                                                )}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() =>
                                                    handlePublishedStatus(
                                                        document._id,
                                                        document.isPublished
                                                    )
                                                }
                                            >
                                                {document.isPublished ? (
                                                    <CheckCircleOutline
                                                        sx={{ color: 'dodgerblue' }}
                                                    />
                                                ) : (
                                                    <DoNotDisturb sx={{ color: '#aaa' }} />
                                                )}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={documents.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Box>
    );
}
