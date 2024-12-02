import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import queries from '../queries';
//import axios from 'axios';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { Card, CardContent, CardHeader, Typography, Button, Box, Grid } from '@mui/material';


function ChapterDetail() {
    const { id } = useParams();
    const [chapter, setChapter] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editChapter, setEditChapter] = useState(null);
    const [deleteChapter, setDeleteChapter] = useState(null);
    const isById = true;
    const attr = 'chapter';
    //const [loading, setLoading] = useState(true);

    const { loading, error, data } = useQuery(queries.GET_CHAPTER_BY_ID, {
        variables: { id: id, }
        ,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (data) {
            setChapter(data.getChapterById); // Only update the state when data changes
        }
    }, [data]);

    const handleOpenEditModal = (chapter) => {
        setShowEditModal(true);
        setEditChapter(chapter);
    };

    const handleOpenDeleteModal = (chapter) => {
        setShowDeleteModal(true);
        setDeleteChapter(chapter);
    };

    const handleCloseModals = () => {
        setShowEditModal(false);
        setShowDeleteModal(false);
    };


    if (chapter) {

        return (
            <div>
                <h2>Chapter</h2>
                <Box display="flex" flexDirection="column" alignItems="center" mt={5}>
                    <Card sx={{ width: '100%', maxWidth: 600, mb: 3 }}>
                        <CardHeader title={chapter.title} />
                        <CardContent>

                            <Typography variant="h6" gutterBottom>
                                Book:

                                <Grid container spacing={2}>
                                    <Grid item xs={12} key={chapter.book._id}>
                                        <Card sx={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant="body1">
                                                    <Link to={`/books/${chapter.book._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                                        {chapter.book.title}
                                                    </Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </Typography>

                        </CardContent>
                    </Card>
                    <Box display="flex" gap={2}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenEditModal(chapter)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleOpenDeleteModal(chapter)}
                        >
                            Delete
                        </Button>
                    </Box>

                    {showEditModal && (
                        <EditModal
                            isOpen={showEditModal}
                            chapter={editChapter}
                            handleClose={handleCloseModals}
                            attr={attr}
                        />
                    )}

                    {showDeleteModal && (
                        <DeleteModal
                            isOpen={showDeleteModal}
                            handleClose={handleCloseModals}
                            deleteChapter={deleteChapter}
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

export default ChapterDetail;
