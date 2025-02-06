// /components/DocumentData.js
import {
    Box,
    FormControl,
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
import { useEffect, useState } from 'react';
// import { EditDocumentModal } from '../components/index';
import { Search, CheckCircleOutline, DoNotDisturb } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useNotification } from '../utilities/NotificationContext';

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
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [loading, setLoading] = useState(true);
    const { showNotification } = useNotification();

    useEffect(() => {
        async function fetchDocuments() {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/document/`);
                const data = await response.json();
                if (response.ok) {
                    setDocuments(data.documents || []);
                } else {
                    showNotification('Error fetching documents', 'error');
                }
            } catch (error) {
                showNotification('Failed to load documents', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchDocuments();
    }, [refreshTrigger]);

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const filteredDocuments = documents.filter((doc) =>
        showOnlyPublished ? doc.isPublished : true
    );

    const displayedDocuments = filteredDocuments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ width: '100%', overflowX: 'auto', padding: 2 }}>
            <Box sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <OutlinedInput
                        placeholder="Search"
                        startAdornment={<InputAdornment position="start"><Search /></InputAdornment>}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </FormControl>
            </Box>
            <TableContainer>
                {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={300} />
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {showPublishedColumn && (
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
                                        active={sortConfig.key === 'title'}
                                        direction={sortConfig.direction}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell>File</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedDocuments.map((doc) => (
                                <TableRow key={doc._id}>
                                    {showPublishedColumn && (
                                        <TableCell>
                                            <CheckCircleOutline
                                                sx={{ color: doc.isPublished ? 'green' : 'grey' }}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell>{doc.title}</TableCell>
                                    <TableCell>{doc.category}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={documents.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => setRowsPerPage(+e.target.value)}
            />
        </Box>
    );
}
