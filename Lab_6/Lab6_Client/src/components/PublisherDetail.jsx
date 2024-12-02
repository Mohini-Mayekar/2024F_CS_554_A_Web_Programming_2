import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import queries from '../queries';
//import axios from 'axios';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { Card, CardContent, CardHeader, Typography, Button, Box, Grid } from '@mui/material';


function PublisherDetail() {
    const { id } = useParams();
    const [publisher, setPublisher] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editPublisher, setEditPublisher] = useState(null);
    const [deletePublisher, setDeletePublisher] = useState(null);
    const isById = true;
    const attr = 'publisher';
    //const [loading, setLoading] = useState(true);

    const { loading, error, data } = useQuery(queries.GET_PUBLISHER_BY_ID, {
        variables: { id: id, }
        ,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (data) {
            setPublisher(data.getPublisherById); // Only update the state when data changes
        }
    }, [data]);

    const handleOpenEditModal = (publisher) => {
        setShowEditModal(true);
        setEditPublisher(publisher);
    };

    const handleOpenDeleteModal = (publisher) => {
        setShowDeleteModal(true);
        setDeletePublisher(publisher);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };


    if (publisher) {

        return (
            <div>
                <h2>Publisher</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
                        <CardHeader title={publisher.name} />
                        <CardContent>
                            <Typography variant="body1" >
                                <strong>Established Year:</strong> {publisher.establishedYear}
                            </Typography>
                            <Typography variant="body1" >
                                <strong>Location:</strong> {publisher.location}
                            </Typography>

                            <Typography variant="h6" gutterBottom>
                                Books:
                            </Typography>
                            {publisher.books && publisher.books.length > 0 ? (
                                <Grid container spacing={2}>
                                    {publisher.books.map((book) => (
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
                            onClick={() => handleOpenEditModal(publisher)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDeleteModal(publisher)}
                        >
                            Delete
                        </Button>
                    </Box>

                    {showEditModal && (
                        <EditModal
                            isOpen={showEditModal}
                            publisher={editPublisher}
                            handleClose={handleCloseModals}
                            attr={attr}
                        />
                    )}

                    {showDeleteModal && (
                        <DeleteModal
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deletePublisher={deletePublisher}
                            isById={isById}
                            attr={attr}
                        />
                    )}
                </Box>
            </div>
        );
    } else if (loading) {
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
}

export default PublisherDetail;
