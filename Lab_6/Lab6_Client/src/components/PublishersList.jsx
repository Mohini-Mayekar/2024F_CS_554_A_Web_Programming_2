import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import Add from './Add.jsx';
import EditAuthorModal from './EditModal.jsx';
import DeleteAuthorModal from './DeleteModal.jsx';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';


function PublishersList() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editPublisher, setEditPublisher] = useState(null);
    const [deletePublisher, setDeletePublisher] = useState(null);
    const isById = false;
    const attr = 'publisher';

    const { loading, error, data } = useQuery(queries.GET_PUBLISHERS
        , {
            fetchPolicy: 'cache-and-network'
        }
    );
    const handleOpenEditModal = (publisher) => {
        setShowEditModal(true);
        setEditPublisher(publisher);
    };

    const handleOpenDeleteModal = (publisher) => {
        setShowDeleteModal(true);
        setDeletePublisher(publisher);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (data) {
        const { publishers } = data;
        return (
            <div>
                <h2>Publishers</h2>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mr: 1 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    Add Publisher
                </Button>
                {showAddForm && (
                    <Add type='publisher' closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />
                <Box
                    sx={{
                        mx: 'auto',
                        width: '50%',
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
                                {publishers.map((publisher) => (
                                    <TableRow key={publisher._id}>
                                        <TableCell>
                                            <Link to={`/publishers/${publisher._id}`}>
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
                                                    {publisher.name}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1, mr: 1 }}
                                                onClick={() => handleOpenEditModal(publisher)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleOpenDeleteModal(publisher)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

                {showEditModal && (
                    <EditAuthorModal
                        isOpen={showEditModal}
                        publisher={editPublisher}
                        handleClose={handleCloseModals}
                        attr={attr}
                    />
                )}

                {showDeleteModal && (
                    <DeleteAuthorModal
                        isOpen={showDeleteModal}
                        handleClose={handleCloseModals}
                        deletePublisher={deletePublisher}
                        isById={isById}
                        attr={attr}
                    />
                )}
            </div>
        );
    } else if (loading) {
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
}


export default PublishersList;
