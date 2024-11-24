import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import queries from '../queries';
//import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import EditAuthorModal from './EditAuthorModal';
import DeleteAuthorModal from './DeleteAuthorModal';
//import { Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
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
                <br />
                <br />
                <div className='card' key={author.id}>
                    <div className='card-body'>
                        <h5 className='card-title'>
                            {author.name}
                        </h5>
                        Bio: {author.bio}
                        <br></br>
                        Date of Birth : {author.dateOfBirth}
                        <br />
                        {author.books && author.books.map((book) => {
                            return (
                                <div className='card' key={book._id}>
                                    <div className='card-body'>
                                        <h5 className='card-title'>
                                            <Link to={`/books/${book._id}`}>{book.title}</Link>
                                        </h5>
                                        <br />
                                    </div>
                                </div>
                            );
                        })}
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

                {
                    showEditModal && (
                        <EditAuthorModal
                            isOpen={showEditModal}
                            author={editAuthor}
                            handleClose={handleCloseModals}
                        />
                    )
                }

                {
                    showDeleteModal && (
                        <DeleteAuthorModal
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deleteAuthor={deleteAuthor}
                            isById={isById}
                        />
                    )
                }
            </div>
        );
    } else if (loading) {
        return <div>Loading</div>;
    } else if (error) {
        return <div>{error.message}</div>;
    }
}

export default AuthorDetail;
