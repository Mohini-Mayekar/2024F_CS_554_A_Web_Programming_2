import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import Add from './Add.jsx';
import EditModal from './EditModal.jsx';
import DeleteModal from './DeleteModal.jsx';
import { Link } from 'react-router-dom';
import { Button, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';


function BooksList() {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [deleteBook, setDeleteBook] = useState(null);
    const isById = false;
    const attr = 'book';
    try {
        const { loading, error, data } = useQuery(queries.GET_BOOKS
            , {
                fetchPolicy: 'cache-and-network'
            }
        );
        const handleOpenEditModal = (book) => {
            setShowEditModal(true);
            setEditBook(book);
        };

        const handleOpenDeleteModal = (book) => {
            setShowDeleteModal(true);
            setDeleteBook(book);
        };
        const closeAddFormState = () => {
            setShowAddForm(false);
        };

        const handleCloseModals = () => {
            setShowEditModal(false);
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
            const { books } = data;
            // alert(books);
            return (
                <div>
                    <h2>Books</h2>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        Add
                    </Button>
                    {showAddForm && (
                        <Add type='book' closeAddFormState={closeAddFormState} />
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
                                    {books.map((book) => (
                                        <TableRow key={book._id}>
                                            <TableCell>
                                                <Link to={`/books/${book._id}`}>
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
                                                        {book.title}
                                                    </Typography>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    sx={{ mt: 1, mr: 1 }}
                                                    onClick={() => handleOpenEditModal(book)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    sx={{ mt: 1 }}
                                                    onClick={() => handleOpenDeleteModal(book)}
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
                </div>
            );
        }
    }
    catch (e) {
        alert('error:' + e);
        console.error(e);
    }
}


export default BooksList;
