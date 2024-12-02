import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import Add from './Add.jsx';
import DeleteModal from './DeleteModal.jsx';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';


function ChaptersList({ bookId }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteChapter, setDeleteChapter] = useState(null);
    const [chapterList, setChapterList] = useState([]);
    const isById = false;
    const attr = 'chapter';
    console.log('chaptersList bookId : ' + bookId);
    try {
        const { loading, error, data, refetch } = useQuery(queries.GET_CHAPTERS_BY_BOOK_ID
            , {
                variables: { bookId: bookId }
                ,
                fetchPolicy: 'cache-and-network'
            }
        );

        useEffect(() => {
            if (data) {
                setChapterList(data.getChaptersByBookId); // Only update the state when data changes
                //console.log(data.getBookById);
            }
        }, [data]);

        const handleOpenDeleteModal = (chapter) => {
            setShowDeleteModal(true);
            setDeleteChapter(chapter);
        };
        const closeAddFormState = () => {
            setShowAddForm(false);
        };

        const handleCloseModals = () => {
            setShowDeleteModal(false);
        };

        if (loading) {
            return (<div>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <Typography>Loading</Typography>
                </Box>
            </div>);
        } else if (error) {
            return (<div>
                <Box display="flex" justifyContent="center" mt={5}>
                    <Typography color="error">Error: {error.message}</Typography>
                </Box>
            </div>
            );
        }
        else if (data) {
            //console.log('getChaptersByBookId: ' + JSON.stringify(data.getChaptersByBookId));
            const { chapters } = data.getChaptersByBookId;
            // alert(books);
            return (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        Add Chapter
                    </Button>
                    {showAddForm && (
                        <Add type='chapter' closeAddFormState={closeAddFormState} bookId={bookId} />
                    )}
                    <br />
                    <br />
                    <Box
                        sx={{
                            mx: 'auto',
                            width: '95%',
                            mt: 3,
                            p: 3,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <TableContainer component={Card}
                            sx={{
                                boxShadow: 3,
                                p: 2,
                                borderRadius: 2,
                            }}
                        >
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {chapterList ? (
                                        chapterList.map((chapter) => (
                                            <TableRow key={chapter._id}>
                                                <TableCell>
                                                    <Link to={`/chapters/${chapter._id}`}>
                                                        <Typography
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                '&:hover': {
                                                                    textDecoration: 'underline'
                                                                }
                                                            }}
                                                            variant='h6'
                                                            component='h3'
                                                        >
                                                            {chapter.title}
                                                        </Typography>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="contained"
                                                        color="error"
                                                        sx={{ mt: 1 }}
                                                        onClick={() => handleOpenDeleteModal(chapter)}
                                                    >
                                                        Delete Chapter
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))

                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">
                                                <Typography variant="body2">No chapters available.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>

                    {showDeleteModal && (
                        <DeleteModal
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deleteChapter={deleteChapter}
                            isById={isById}
                            attr={attr}
                            refetch={refetch}
                        />
                    )}
                </div>
            );
        }
    }
    catch (e) {
        alert('error:' + e);
        console.error(e);
    }
}


export default ChaptersList;
