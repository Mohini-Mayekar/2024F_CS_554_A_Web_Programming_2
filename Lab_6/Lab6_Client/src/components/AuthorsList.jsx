import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import Add from './Add.jsx';
import EditAuthorModal from './EditAuthorModal';
import DeleteAuthorModal from './DeleteAuthorModal';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';


function AuthorsList() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editAuthor, setEditAuthor] = useState(null);
    const [deleteAuthor, setDeleteAuthor] = useState(null);
    const isById = false;

    const { loading, error, data } = useQuery(queries.GET_AUTHORS, {
        fetchPolicy: 'cache-and-network'
    });
    const handleOpenEditModal = (author) => {
        setShowEditModal(true);
        setEditAuthor(author);
    };

    const handleOpenDeleteModal = (author) => {
        setShowDeleteModal(true);
        setDeleteAuthor(author);
    };
    const closeAddFormState = () => {
        setShowAddForm(false);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    if (data) {
        const { authors } = data;
        return (
            <div>
                <h2>Authors</h2>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 1, mr: 1 }}
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    Add Author
                </Button>
                {showAddForm && (
                    <Add type='author' closeAddFormState={closeAddFormState} />
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
                                {authors.map((author) => (
                                    <TableRow key={author._id}>
                                        <TableCell>
                                            <Link to={`/authors/${author._id}`}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 'bold'
                                                    }}
                                                    variant='h6'
                                                    component='h3'
                                                >
                                                    {author.name}
                                                </Typography>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                sx={{ mt: 1, mr: 1 }}
                                                onClick={() => handleOpenEditModal(author)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="error"
                                                sx={{ mt: 1 }}
                                                onClick={() => handleOpenDeleteModal(author)}
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
                {/* <Grid>
                    {authors.map((author) => {
                        return (
                            <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={author._id}>
                                <Card
                                    variant='outlined'
                                    sx={{
                                        maxWidth: 250,
                                        height: 'auto',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
                                        borderRadius: 5,
                                        border: '1px solid #1e8678',
                                        boxShadow:
                                            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                                    }}
                                >
                                    <CardActionArea>
                                        <CardContent>
                                            <Link to={`/authors/${author._id}`}>
                                                <Typography
                                                    sx={{
                                                        borderBottom: '1px solid #1e8678',
                                                        fontWeight: 'bold'
                                                    }}
                                                    gutterBottom
                                                    variant='h6'
                                                    component='h3'
                                                >
                                                    {author.name}
                                                </Typography>
                                            </Link>
                                            <Typography variant='body2' color='textSecondary' component='p'>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ mt: 1, mr: 1 }}
                                                    onClick={() => handleOpenEditModal(author)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ mt: 1 }}
                                                    onClick={() => handleOpenDeleteModal(author)}
                                                >
                                                    Delete
                                                </Button>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid >
                        );
                    })}
                </Grid> */}
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
            </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}


export default AuthorsList;
