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
    Typography,
    IconButton
} from '@mui/material';
import { useState, useEffect } from 'react';
import { DoNotDisturb, CheckCircleOutline, Edit, MovieCreation, Search } from '@mui/icons-material';
import { PictureAsPdf, Description, Image, VideoLibrary } from '@mui/icons-material';
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import ExcelIcon from '@mui/icons-material/GridOn'
import WordIcon from '@mui/icons-material/Description'
import PowerPointIcon from '@mui/icons-material/Slideshow'
import { useTheme } from '@mui/material/styles';

export default function DocumentData({ refreshTrigger, showPublishedColumn = true, showEditColumn=true }) {
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
    }, [refreshTrigger]);

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



    const renderFileTypeIcon = (url) => {
        const fileExtension = url.split('?')[0].split('.').pop().toLowerCase();

        switch(fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <img src={url} alt='document thumbnail' style={{width: '50px', height: '50px', objectFit: 'cover'}} />
            case 'mp4':
                return <MovieCreation style={{color: '#ed5d09' }} />
            case 'pdf':
                return <PdfIcon style={{ color: '#ED2224' }} />
            case 'xlsx':
            case 'xls':
                return <ExcelIcon style={{ color: '#1D6F42' }} />
            case 'docx':
            case 'doc':
                return <WordIcon style={{ color: '#2b579a' }} />
            case 'pptx':
            case 'ppt':
                return <PowerPointIcon style={{ color: '#D04423'}} />
            default:
                return <Typography variant='overline'>no preview</Typography>
        }
    }

    const handlePublishedStatus = async (documentId, currentStatus) => {
        if (!showPublishedColumn) return;

        try {
            const response = await fetch(`http://localhost:8005/api/document/status/${documentId}`, {
                method: 'PATCH',
                body: JSON.stringify({ isPublished: !currentStatus }),
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
                                { showPublishedColumn && (
                                    <TableCell>
                                        <TableSortLabel
                                            active={sortConfig.key === 'isPublished'}
                                            direction={sortConfig.direction}
                                            onClick={() => handleSort('isPublished')}
                                        >
                                            Published
                                        </TableSortLabel>
                                    </TableCell>
                                )}
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
                                <TableCell>Document</TableCell>
                                <TableCell>

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
                                        { showPublishedColumn && (
                                            <TableCell>
                                                <IconButton onClick={() => handlePublishedStatus(document._id, document.isPublished)}>
                                                    {document.isPublished ? (
                                                        <CheckCircleOutline sx={{color: 'dodgerblue'}}/>
                                                    ) : (
                                                        <DoNotDisturb sx={{color: '#aaa'}}/>
                                                    )}
                                                </IconButton>
                                            </TableCell>
                                        )}
                                        <TableCell>{document.category}</TableCell>
                                        <TableCell>{document.title}</TableCell>
                                        <TableCell sx={{justifyContent: 'center'}}>
                                            {renderFileTypeIcon(document.downloadUrl)}
                                        </TableCell>
                                        <TableCell sx={{justifyContent: 'center'}}>
                                            <Edit />
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
