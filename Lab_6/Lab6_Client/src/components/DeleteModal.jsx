import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import ReactModal from 'react-modal';

//Import the file where my query constants are defined
import queries from '../queries';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box, TextField } from '@mui/material';

//For react-modal
ReactModal.setAppElement('#root');
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        border: '1px solid #28547a',
        borderRadius: '4px'
    }
};

function DeleteModal(props) {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const isById = props.isById;
    const attr = props.attr;
    if (attr == 'author') {
        const [author, setAuthor] = useState(props.deleteAuthor);
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const [removeAuthor] = useMutation(queries.DELETE_AUTHOR
            , {
                update(cache) {
                    cache.modify({
                        fields: {
                            authors(existingAuthors, { readField }) {
                                return existingAuthors.filter(
                                    (authorRef) => author._id !== readField('_id', authorRef)
                                );
                            }
                        }
                    });
                }
            }
        );

        const handleCloseDeleteModal = () => {
            setShowDeleteModal(false);
            setAuthor(null);
            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Author'
                    style={customStyles}
                >
                    <div>
                        <Typography variant="h6" align="center">
                            Are you sure you want to delete "{author.name}"?
                        </Typography>
                        {error && <Typography
                            variant="body1"
                            align="center"
                            gutterBottom
                            className='errorMessage'
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {errorMsg}
                        </Typography>}
                        <form
                            className='form'
                            id='delete-author'
                            onSubmit={async (e) => {
                                try {
                                    e.preventDefault();
                                    let errors = [];
                                    let id = author._id;
                                    try {
                                        id = validateId(id);
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                    removeAuthor({
                                        variables: {
                                            id: id
                                        }
                                    });
                                    setShowDeleteModal(false);

                                    alert('Author Deleted');
                                    props.handleClose();
                                    if (isById) {
                                        navigate('/authors');
                                    }
                                } catch (e) {
                                    setError(true);
                                    setErrorMsg("Error deleting author:" + e);
                                }
                            }}
                        >
                            <Box>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type="submit"
                                    >
                                        Delete Author
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="string"
                                        onClick={handleCloseDeleteModal}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </div>
                </ReactModal>
            </div>
        );
    } else if (attr == 'publisher') {
        const [publisher, setPublisher] = useState(props.deletePublisher);
        const [removePublisher] = useMutation(queries.DELETE_PUBLISHER
            , {
                update(cache) {
                    cache.modify({
                        fields: {
                            publishers(existingPublishers, { readField }) {
                                return existingPublishers.filter(
                                    (publisherRef) => publisher._id !== readField('_id', publisherRef)
                                );
                            }
                        }
                    });
                }
            }
        );

        const handleCloseDeleteModal = () => {
            setShowDeleteModal(false);
            setPublisher(null);
            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Publisher'
                    style={customStyles}
                >
                    <div>
                        <Typography variant="h6" align="center">
                            Are you sure you want to delete "{publisher.name}"?
                        </Typography>

                        <form
                            className='form'
                            id='delete-publisher'
                            onSubmit={(e) => {
                                e.preventDefault();
                                removePublisher({
                                    variables: {
                                        id: publisher._id
                                    }
                                });
                                setShowDeleteModal(false);

                                alert('Publisher Deleted');
                                props.handleClose();
                                if (isById) {
                                    navigate('/publishers');
                                }
                            }}
                        >
                            <Box>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type="submit"
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="string"
                                        onClick={handleCloseDeleteModal}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </div>
                </ReactModal>
            </div>
        );
    } else if (attr == 'book') {
        const [book, setBook] = useState(props.deleteBook);
        const [removeBook] = useMutation(queries.DELETE_BOOK
            , {
                update(cache) {
                    cache.modify({
                        fields: {
                            books(existingBooks, { readField }) {
                                return existingBooks.filter(
                                    (bookRef) => book._id !== readField('_id', bookRef)
                                );
                            }
                        }
                    });
                }
            }
        );

        const handleCloseDeleteModal = () => {
            setShowDeleteModal(false);
            setBook(null);
            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Book'
                    style={customStyles}
                >
                    <div>
                        <Typography variant="h6" align="center">
                            Are you sure you want to delete "{book.title}"?
                        </Typography>

                        <form
                            className='form'
                            id='delete-book'
                            onSubmit={(e) => {
                                e.preventDefault();
                                removeBook({
                                    variables: {
                                        id: book._id
                                    }
                                });
                                setShowDeleteModal(false);

                                alert('Book Deleted');
                                props.handleClose();
                                if (isById) {
                                    navigate('/books');
                                }
                            }}
                        >
                            <Box>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type="submit"
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="string"
                                        onClick={handleCloseDeleteModal}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </div>
                </ReactModal>
            </div>
        );
    } else if (attr == 'chapter') {
        const [chapter, setChapter] = useState(props.deleteChapter);
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const [removeChapter] = useMutation(queries.DELETE_CHAPTER
            , {
                update(cache) {
                    cache.modify({
                        fields: {
                            chapters(existingChapters, { readField }) {
                                return existingChapters.filter(
                                    (chapterRef) => chapter._id !== readField('_id', chapterRef)
                                );
                            }
                        }
                    });
                },
                onCompleted: () => {
                    // Refetch the data after the mutation is completed to ensure UI consistency.
                    if (!isById) {
                        props.refetch();

                    }
                }
            }
        );

        const handleCloseDeleteModal = () => {
            setShowDeleteModal(false);
            setChapter(null);
            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='deleteModal'
                    isOpen={showDeleteModal}
                    contentLabel='Delete Chapter'
                    style={customStyles}
                >
                    <div>
                        <Typography variant="h6" align="center">
                            Are you sure you want to delete "{chapter.title}"?
                        </Typography>

                        {error && <Typography
                            variant="body1"
                            align="center"
                            gutterBottom
                            className='errorMessage'
                            style={{ whiteSpace: 'pre-line' }}
                        >
                            {errorMsg}
                        </Typography>}

                        <form
                            className='form'
                            id='delete-chapter'
                            onSubmit={async (e) => {
                                try {
                                    e.preventDefault();
                                    let errors = [];
                                    let id = chapter._id;
                                    try {
                                        id = validateId(id);
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                    await removeChapter({
                                        variables: {
                                            id: id
                                        }
                                    });
                                    setShowDeleteModal(false);

                                    alert('Chapter Deleted');
                                    props.handleClose();

                                    if (isById) {
                                        navigate('/books');
                                    }
                                    else {
                                        props.refetch();
                                    }
                                } catch (e) {
                                    setError(true);
                                    setErrorMsg("Error deleting author:" + e);
                                }
                            }}
                        >
                            <Box>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        type="submit"
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="string"
                                        onClick={handleCloseDeleteModal}
                                    >
                                        Cancel
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </div>
                </ReactModal>
            </div>
        );
    }

}

export default DeleteModal;
