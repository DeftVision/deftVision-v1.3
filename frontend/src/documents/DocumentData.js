import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {EditDocumentModal} from '../components/index';
import {CheckCircleOutline, DoNotDisturb, Edit, MovieCreation, Search,} from '@mui/icons-material';
import PdfIcon from '@mui/icons-material/PictureAsPdf';
import ExcelIcon from '@mui/icons-material/GridOn';
import WordIcon from '@mui/icons-material/Description';
import PowerPointIcon from '@mui/icons-material/Slideshow';
import {useTheme} from '@mui/material/styles';

export default function DocumentData({
                                         refreshTrigger,
                                         showPublishedColumn = true,
                                         showOnlyPublished = false,
                                         showEditColumn = true,
                                     }) {
    const theme = useTheme();
    const [documents, setDocuments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getDocuments() {
            setLoading(true);

            try {
                const response = await fetch('http://localhost:8005/api/document/', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'},
                });

                const _response = await response.json();

                if (response.ok && _response.documents) {
                    setDocuments(_response.documents);
                } else {
                    setError('Error fetching document data');
                }
            } catch (error) {
                setError('Failed to get document data');
            } finally {
                setLoading(false);
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
        setSortConfig({key, direction});
    };

    const handleEdit = (document) => {
        setSelectedDocument(document);
        setOpenEditModal(true);
    };

    const handleCloseModal = () => {
        setOpenEditModal(false);
        setSelectedDocument(null);
    };

    const handleSave = async (updatedDocument, newFile) => {
        try {
            let newDownloadUrl = updatedDocument.downloadUrl;

            if (newFile) {
                const formData = new FormData();
                formData.append('file', newFile);

                const uploadResponse = await fetch(`/api/s3/upload`, {
                    method: 'POST',
                    body: formData,
                });

                const uploadResult = await uploadResponse.json();
                if (uploadResponse.ok) {
                    newDownloadUrl = uploadResult.downloadUrl;
                } else {
                    throw new Error('Failed to upload new file');
                }
            }

            const response = await fetch(`/api/document/${updatedDocument._id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({...updatedDocument, downloadUrl: newDownloadUrl}),
            });

            if (response.ok) {
                const updatedDoc = await response.json();
                setDocuments((prev) =>
                    prev.map((doc) => (doc._id === updatedDocument._id ? updatedDoc : doc))
                );
                handleCloseModal();
            } else {
                throw new Error('Failed to update document');
            }
        } catch (error) {
            console.error('Error saving document:', error);
            throw error;
        }
    };

    const sortedDocuments = [...documents].sort((a, b) => {
        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const filteredDocuments = sortedDocuments.filter((document) => {
        if (showOnlyPublished) {
            return document.isPublished;
        }
        return true;
    });

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

    const renderFileTypeIcon = (url) => {
        const fileExtension = url.split('?')[0].split('.').pop().toLowerCase();

        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return (
                    <img
                        src={url}
                        alt="document thumbnail"
                        style={{width: '50px', height: '50px', objectFit: 'cover'}}
                    />
                );
            case 'mp4':
                return <MovieCreation style={{color: '#ed5d09'}}/>;
            case 'pdf':
                return <PdfIcon style={{color: '#ED2224'}}/>;
            case 'xlsx':
            case 'xls':
                return <ExcelIcon style={{color: '#1D6F42'}}/>;
            case 'docx':
            case 'doc':
                return <WordIcon style={{color: '#2b579a'}}/>;
            case 'pptx':
            case 'ppt':
                return <PowerPointIcon style={{color: '#D04423'}}/>;
            default:
                return <Typography variant="overline">no preview</Typography>;
        }
    };

    const handlePublishedStatus = async (documentId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:8005/api/document/status/${documentId}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({isPublished: !currentStatus}),
            });

            if (response.ok) {
                const updatedDocuments = documents.map((doc) =>
                    doc._id === documentId ? {...doc, isPublished: !currentStatus} : doc
                );
                setDocuments(updatedDocuments);
            } else {
                setError('Failed to update document status');
            }
        } catch (error) {
            console.error('Error updating document status:', error);
            setError('Error updating document status');
        }
    };


    return (
        <Box sx={{display: 'flex', justifyContent: 'center', marginTop: 4, minWidth: '900px', padding: '10px'}}>
            <Box>
                <Box
                    width="100%"
                    sx={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <FormControl>
                        <OutlinedInput
                            id="outlined-adornment-search"
                            startAdornment={
                                <InputAdornment position="start">
                                    <Search/>
                                </InputAdornment>
                            }
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </FormControl>
                </Box>
                <Box>
                    <TableContainer>
                        {loading ? (
                            <Box>
                                {[...Array(4)].map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        variant='rectangular'
                                        height={25}
                                        width='100%'
                                        sx={{
                                            marginBottom: 2,
                                        }}
                                    />
                                ))}
                            </Box>
                        ) : (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {showPublishedColumn && (
                                            <TableCell sx={{width: {xs: '20%', sm: '10%'}}}>
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
                                        <TableCell>File</TableCell>
                                        {showEditColumn && <TableCell/>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {displayedDocuments.map((document) => (
                                        <TableRow
                                            key={document._id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: theme.palette.action.hover,
                                                    cursor: 'pointer',
                                                },
                                            }}
                                        >
                                            {showPublishedColumn && (
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => handlePublishedStatus(document._id, document.isPublished)}
                                                    >
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
                                            <TableCell onClick={() => handleOpenFile(document.downloadUrl)}>
                                                {renderFileTypeIcon(document.downloadUrl)}
                                            </TableCell>
                                            {showEditColumn && (
                                                <TableCell>
                                                    <IconButton onClick={() => handleEdit(document)}>
                                                        <Edit/>
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
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
            <EditDocumentModal
                open={openEditModal}
                onClose={handleCloseModal}
                document={selectedDocument}
                onSave={handleSave}
            />
        </Box>
    );
}
