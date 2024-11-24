import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import queries from '../queries';
import Add from './Add.jsx';
import EditAuthorModal from './EditAuthorModal';
import DeleteAuthorModal from './DeleteAuthorModal';
import { Link } from 'react-router-dom';


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
                <button className='button' onClick={() => setShowAddForm(!showAddForm)}>
                    Add Author
                </button>
                {showAddForm && (
                    <Add type='author' closeAddFormState={closeAddFormState} />
                )}
                <br />
                <br />

                {authors.map((author) => {
                    return (
                        <div className='card' key={author._id}>
                            <div className='card-body'>
                                <h5 className='card-title'>
                                    <Link to={`/authors/${author._id}`}>{author.name}</Link>
                                </h5>
                                {/* Bio: {author.bio}
                                Date of Birth : {author.dateOfBirth} */}
                                <br />
                                <button
                                    className='button'
                                    onClick={() => {
                                        handleOpenEditModal(author);
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className='button'
                                    onClick={() => {
                                        handleOpenDeleteModal(author);
                                    }}
                                >
                                    Delete
                                </button>
                                <br />
                            </div>
                        </div>
                    );
                })}
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
