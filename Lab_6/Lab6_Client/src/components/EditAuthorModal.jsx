import React, { useState } from 'react';

import ReactModal from 'react-modal';
import { useQuery, useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

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
                    <div className='form-group'>
                        <label>
                            Name:
                            <br />
                            <input
                                ref={(node) => {
                                    name = node;
                                }}
                                defaultValue={author.name}
                                autoFocus={true}
                            />
                        </label>
                    </div>
                    <br />
                    <div className='form-group'>
                        <label>
                            Bio:
                            <br />
                            <input
                                ref={(node) => {
                                    bio = node;
                                }}
                                defaultValue={author.bio}
                            />
                        </label>
                    </div>
                    <br />

                    <div className='form-group'>
                        <label>
                            Date of Birth:
                            <input
                                ref={(node) => {
                                    dateOfBirth = node;
                                }}
                                defaultValue={author.dateOfBirth}
                            />
                            {/* <select
                                defaultValue={author.employer._id}
                                className='form-control'
                                ref={(node) => {
                                    dateOfBirth = node;
                                }}
                            >
                                {employers &&
                                    employers.map((employer) => {
                                        return (
                                            <option key={employer._id} value={employer._id}>
                                                {employer.name}
                                            </option>
                                        );
                                    })}
                            </select> */}
                        </label>
                    </div>
                    <br />
                    <br />
                    <button className='button add-button' type='submit'>
                        Update Author
                    </button>
                </form>

                <button className='button cancel-button' onClick={handleCloseEditModal}>
                    Cancel
                </button>
            </ReactModal>
        </div>
    );
}

export default EditAuthorModal;