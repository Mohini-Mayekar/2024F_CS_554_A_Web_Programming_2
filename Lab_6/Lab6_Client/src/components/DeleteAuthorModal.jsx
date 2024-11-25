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

function DeleteAuthorModal(props) {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(props.isOpen);
    const [author, setAuthor] = useState(props.deleteAuthor);
    const isById = props.isById;

    const [removeAuthor] = useMutation(queries.DELETE_AUTHOR, {
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
    });

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setAuthor(null);
        props.handleClose();
    };

    return (
        <div>
            {/*Delete Author Modal */}
            <ReactModal
                name='deleteModal'
                isOpen={showDeleteModal}
                contentLabel='Delete Author'
                style={customStyles}
            >
                {/*Here we set up the mutation, since I want the data on the page to update
				after I have added someone, I need to update the cache. If not then
				I need to refresh the page to see the data updated 

				See: https://www.apollographql.com/docs/react/essentials/mutations for more
				information on Mutations
			*/}
                <div>
                    <Typography variant="h6" align="center">
                        Are you sure you want to delete "{author.name}"?
                    </Typography>

                    <form
                        className='form'
                        id='delete-employee'
                        onSubmit={(e) => {
                            e.preventDefault();
                            removeAuthor({
                                variables: {
                                    id: author._id
                                }
                            });
                            setShowDeleteModal(false);

                            alert('Author Deleted');
                            props.handleClose();
                            if (isById) {
                                navigate('/authors');
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
}

export default DeleteAuthorModal;
