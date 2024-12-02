import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import queries from '../queries';
//import axios from 'axios';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { Card, CardContent, CardHeader, Typography, Button, Box, Grid } from '@mui/material';
import { blue } from '@mui/material/colors';
import ChaptersList from './ChaptersList';


function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [deleteBook, setDeleteBook] = useState(null);
    const isById = true;
    const attr = 'book';
    //const [loading, setLoading] = useState(true);

    const { loading, error, data: bookData } = useQuery(queries.GET_BOOK_BY_ID, {
        variables: { id: id, }
        ,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (bookData) {
            setBook(bookData.getBookById); // Only update the state when data changes
            //console.log(data.getBookById);
        }
    }, [bookData]);

    const handleOpenEditModal = (book) => {
        setShowEditModal(true);
        setEditBook(book);
    };

    const handleOpenDeleteModal = (book) => {
        setShowDeleteModal(true);
        setDeleteBook(book);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };
    if (loading) {
        return (<div><Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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

    else if (book) {

        return (
            <div>
                <h2>Book</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
                        <CardHeader title={book.title} />
                        <CardContent>
                            <Typography variant="body1" >
                                <strong>Publication Date:</strong> {book.publicationDate}
                            </Typography>
                            <Typography variant="body1" >
                                <strong>Genre:</strong> {book.genre}
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Author:

                                <Grid container spacing={2}>
                                    <Grid item xs={12} key={book.author._id}>
                                        <Card sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant="body1">
                                                    <Link to={`/authors/${book.author._id}`} style={{ textDecoration: 'none', color: blue }}>
                                                        {book.author.name}
                                                    </Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Publisher:

                                <Grid container spacing={2}>
                                    <Grid item xs={12} key={book.publisher._id}>
                                        <Card sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant="body1">
                                                    <Link to={`/publishers/${book.publisher._id}`} style={{ textDecoration: 'none', color: blue }}>
                                                        {book.publisher.name}
                                                    </Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Chapters:
                                <Grid>
                                    <ChaptersList bookId={book._id} />
                                </Grid>
                            </Typography>

                        </CardContent>
                    </Card>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenEditModal(book)}
                        >
                            Edit Book
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDeleteModal(book)}
                        >
                            Delete Book
                        </Button>
                    </Box>

                    {showEditModal && (
                        <EditModal
                            isOpen={showEditModal}
                            book={editBook}
                            handleClose={handleCloseModals}
                            attr={attr}
                        />
                    )}

                    {showDeleteModal && (
                        <DeleteModal
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deleteBook={deleteBook}
                            isById={isById}
                            attr={attr}
                        />
                    )}
                </Box>
            </div>
        );
    }
}

export default BookDetail;
