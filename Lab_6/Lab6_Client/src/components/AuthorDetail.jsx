import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import queries from '../queries';
//import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import EditAuthorModal from './EditAuthorModal';
import DeleteAuthorModal from './DeleteAuthorModal';
import { Card, CardContent, CardHeader, Typography, Button, Box, CircularProgress, Grid } from '@mui/material';
//import { OpenInNew, Link as LinkIcon } from '@mui/icons-material';


function AuthorDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [author, setAuthor] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editAuthor, setEditAuthor] = useState(null);
    const [deleteAuthor, setDeleteAuthor] = useState(null);
    const isById = true;
    //const [loading, setLoading] = useState(true);

    const { loading, error, data } = useQuery(queries.GET_AUTHOR_BY_ID, {
        variables: { id: id, },
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (data) {
            setAuthor(data.getAuthorById); // Only update the state when data changes
        }
    }, [data]);

    const handleOpenEditModal = (author) => {
        setShowEditModal(true);
        setEditAuthor(author);
    };

    const handleOpenDeleteModal = (author) => {
        setShowDeleteModal(true);
        setDeleteAuthor(author);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };


    if (author) {

        return (
            <div>
                <h2>Author</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
                        <CardHeader title={author.name} />
                        <CardContent>
                            <Typography variant="body1" >
                                <strong>Date of Birth:</strong> {author.dateOfBirth}
                            </Typography>
                            <Typography variant="body1" >
                                <strong>Bio:</strong> {author.bio}
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Books:
                            </Typography>
                            {author.books && author.books.length > 0 ? (
                                <Grid container spacing={2}>
                                    {author.books.map((book) => (
                                        <Grid item xs={12} key={book._id}>
                                            <Card sx={{ width: '100%' }}>
                                                <CardContent>
                                                    <Typography variant="body1">
                                                        <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                            {book.title}
                                                        </Link>
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body2">No books available.</Typography>
                            )}
                        </CardContent>
                    </Card>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenEditModal(author)}
                        >
                            Edit Author
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDeleteModal(author)}
                        >
                            Delete
                        </Button>
                    </Box>

                    {showEditModal && (
                        <EditAuthorModal
                            isOpen={showEditModal}
                            author={editAuthor}
                            handleClose={handleCloseModals}
                        />
                    )}

                    {showDeleteModal && (
                        <DeleteAuthorModal
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deleteAuthor={deleteAuthor}
                            isById={isById}
                        />
                    )}
                </Box>
            </div>
        );
    } else if (loading) {
        return (<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <Typography>Loading</Typography>
        </Box>);
    } else if (error) {
        return (
            <Box display="flex" justifyContent="center" mt={5}>
                <Typography color="error">Error: {error.message}</Typography>
            </Box>
        );
    }
}

export default AuthorDetail;
