import React, { useState } from 'react';

import ReactModal from 'react-modal';
import { useQuery, useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';
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

function EditAuthorModal(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const [author, setAuthor] = useState(props.author);
    // const { loading, error, data } = useQuery(queries.GET_EMPLOYERS);
    const [editAuthor] = useMutation(queries.EDIT_AUTHOR);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setAuthor(null);

        props.handleClose();
    };

    let name;
    let bio;
    let dateOfBirth;
    // if (data) {
    //     var { employers } = data;
    // }
    // if (loading) {
    //     return <div>loading...</div>;
    // }
    // if (error) {
    //     return <div>{error.message}</div>;
    // }
    return (
        <div>
            <ReactModal
                name='editModal'
                isOpen={showEditModal}
                contentLabel='Edit Author'
                style={customStyles}
            >
                <Typography variant="h5" gutterBottom>
                    Edit Author
                </Typography>
                <form

                    className='form'
                    id='add-author'
                    onSubmit={(e) => {
                        console.log(name.value);
                        console.log(bio.value);
                        console.log(parseInt(dateOfBirth.value));
                        e.preventDefault();
                        editAuthor({
                            variables: {
                                id: props.author._id,
                                name: name.value,
                                bio: bio.value,
                                dateOfBirth: dateOfBirth.value
                            }
                        });
                        name.value = '';
                        bio.value = '';
                        dateOfBirth.value = 'MM/DD/YYYY';
                        setShowEditModal(false);

                        alert('Author Updated');
                        props.handleClose();
                    }}
                >
                    <Box display="flex" flexDirection="column" gap={3}>
                        <TextField
                            label="Name"
                            name="name"
                            defaultValue={author.name}
                            variant="outlined"
                            fullWidth
                            required
                        />

                        <TextField
                            label="Bio"
                            name="bio"
                            defaultValue={author.bio}
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            defaultValue={author.dateOfBirth ? new Date(author.dateOfBirth).toISOString().split('T')[0] : ''}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                                shrink: true
                            }}
                            required
                        />

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="submit"
                            >
                                Update Author
                            </Button>
                            <Button
                                variant="contained"
                                color="string"
                                onClick={handleCloseEditModal}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>

                </form>

                {/* <button className='button cancel-button' onClick={handleCloseEditModal}>
                    Cancel
                </button> */}
            </ReactModal>
        </div>
    );
}

export default EditAuthorModal;