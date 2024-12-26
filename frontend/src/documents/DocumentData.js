import {
    Box,
    FormControl,
    IconButton,
    InputAdornment,
    OutlinedInput,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Typography
} from '@mui/material';
import {useEffect, useState} from 'react';
import { EditDocumentModal } from '../components/index'
import {
    CheckCircleOutline,
    Description,
    DoNotDisturb,
    Edit,
    Image,
    MovieCreation,
    PictureAsPdf,
    Search,
    VideoLibrary
} from '@mui/icons-material';
import PdfIcon from '@mui/icons-material/PictureAsPdf'
import ExcelIcon from '@mui/icons-material/GridOn'
import WordIcon from '@mui/icons-material/Description'
import PowerPointIcon from '@mui/icons-material/Slideshow'
import {useTheme} from '@mui/material/styles';

export default function DocumentData({refreshTrigger, showPublishedColumn = true, showEditColumn = true}) {
    const theme = useTheme();
    const [documents, setDocuments] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({key: 'name', direction: 'asc'});
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    useEffect(() => {
        async function getDocuments() {
            try {
                const response = await fetch('http://localhost:8005/api/document/', {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
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
        setSortConfig({key, direction});
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


    const renderFileTypeIcon = (url) => {
        const fileExtension = url.split('?')[0].split('.').pop().toLowerCase();

        switch (fileExtension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <img src={url} alt='document thumbnail'
                            style={{width: '50px', height: '50px', objectFit: 'cover'}}/>
            case 'mp4':
                return <MovieCreation style={{color: '#ed5d09'}}/>
            case 'pdf':
                return <PdfIcon style={{color: '#ED2224'}}/>
            case 'xlsx':
            case 'xls':
                return <ExcelIcon style={{color: '#1D6F42'}}/>
            case 'docx':
            case 'doc':
                return <WordIcon style={{color: '#2b579a'}}/>
            case 'pptx':
            case 'ppt':
                return <PowerPointIcon style={{color: '#D04423'}}/>
            default:
                return <Typography variant='overline'>no preview</Typography>
        }
    }

    const handlePublishedStatus = async (documentId, currentStatus) => {
        if (!showPublishedColumn) return;

        try {
            const response = await fetch(`http://localhost:8005/api/document/status/${documentId}`, {
                method: 'PATCH',
                body: JSON.stringify({isPublished: !currentStatus}),
                headers: {'Content-Type': 'application/json'}
            });

            if (response.ok) {
                const updatedDocuments = documents.map((document) =>
                    document._id === documentId
                        ? {...document, isPublished: !currentStatus}
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

    const handleEdit = (document) => {
        setSelectedDocument(document);
        setOpenEditModal(true);
    };

    // 1. delete original file from aws
    const handleSave = async (updatedDocument, newFile) => {
        try {
            if (newFile && updatedDocument.downloadUrl) {
                const deleteResponse = await fetch('api/s3/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: updatedDocument.downloadUrl }),
                })
                if (!deleteResponse.ok) {
                    console.error('failed to delete original file')
                    return;
                }
            }

            // 2. upload the file to aws
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
                    console.error('failed to upload the new file')
                }
            }

            // 3. update the document in the database
            const response = await fetch(`api/document/${document._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({
                    ...updatedDocument,
                    downloadUrl: newDownloadUrl,
                })
            });

            if (response.ok) {
                setDocuments((prev) =>
                    prev.map((doc) =>
                        doc.id === updatedDocument._id
                            ? { ...updatedDocument, downloadUrl: newDownloadUrl }
                            : doc
                    )
                )
            } else {
                console.error('Failed to update the document');
            }
        } catch (error) {
            console.error('error updating document:', error);
        }



    }

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
                        flexDirection: 'column'
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
                                            {showPublishedColumn && (
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => handlePublishedStatus(document._id, document.isPublished)}>
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

                                            { showEditColumn && (
                                            <TableCell sx={{justifyContent: 'center'}}>
                                            <IconButton onClick={() => handleEdit(document)}>
                                                    <Edit/>
                                                </IconButton>
                                            </TableCell>
                                            )}
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
        </Box>
    );
}
