import React, { useState } from 'react';

import ReactModal from 'react-modal';
import { useQuery, useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';
import { Button, Typography, Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
    dob_yyyymmdd_format, dob_mmddyyyy_format, validateRange, ifExist, cacheData, throwError, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, deleteFromCache, validateId,
    checkisValidDate, checkisValidName, checkisValidString, checkisValidLocation, updatePublisher, updateAuthor,
    removeIdFromArray, updateBook, checkisValidTitle, validateUniqueChapters, validateYear, clearCache, checkisValidPublicationDate, checkisValidPublication,
    deleteKeyMatches
} from '../helper.jsx';

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

function EditModal(props) {
    const [showEditModal, setShowEditModal] = useState(props.isOpen);
    const attr = props.attr;
    if (attr == 'author') {
        const [author, setAuthor] = useState(props.author);
        const [editAuthor] = useMutation(queries.EDIT_AUTHOR);
        const [name, setName] = useState(author.name || '');
        const [bio, setBio] = useState(author.bio || '');
        const [dateOfBirth, setDateOfBirth] = useState(author.dateOfBirth || '');
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const handleCloseEditModal = () => {
            setShowEditModal(false);
            setAuthor(null);

            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel='Edit Author'
                    style={customStyles}
                >
                    <Typography variant="h5" gutterBottom>
                        Edit
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
                        id='add-author'
                        onSubmit={async (e) => {
                            try {
                                e.preventDefault();

                                let nameF = document.getElementById('name');
                                let bioF = document.getElementById('bio');
                                let dateOfBirthF = document.getElementById('dateOfBirth');
                                let nameVal = name;
                                let bioVal = bio;
                                let dateOfBirthVal = dateOfBirth;
                                let errors = [];
                                let id = props.author._id;
                                // try {
                                //     id = validateId(id);
                                // } catch (err) {
                                //     errors.push(err);
                                // }

                                if (nameF) {
                                    try {
                                        nameVal = checkisValidName(nameF.value, 'Name');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (bioF) {
                                    try {
                                        bioVal = checkisValidString(bioF.value, 'Bio');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (dateOfBirthF) {
                                    try {
                                        dateOfBirthVal = dob_mmddyyyy_format(dateOfBirthF.value);
                                        dateOfBirthVal = checkisValidDate(dateOfBirthVal, 'Date of Birth');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }

                                if (errors.length > 0) {
                                    setError(true);
                                    setErrorMsg(errors.join('\n'));
                                    return;
                                }
                                await editAuthor({
                                    variables: {
                                        id: id,
                                        name: nameVal,
                                        bio: bioVal,
                                        dateOfBirth: dateOfBirthVal
                                    }
                                });
                                setShowEditModal(false);

                                alert('Author Updated');
                                props.handleClose();
                            } catch (e) {
                                setError(true);
                                setErrorMsg("Error editing author:" + e);
                            }

                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                id="name"
                                label="Name"
                                name="name"
                                defaultValue={author.name}
                                variant="outlined"
                                fullWidth
                                required
                            />

                            <TextField
                                id="bio"
                                label="Bio"
                                name="bio"
                                defaultValue={author.bio}
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                            />

                            <TextField
                                id="dateOfBirth"
                                label="Date of Birth"
                                name="dateOfBirth"
                                type="date"
                                defaultValue={dob_yyyymmdd_format(author.dateOfBirth)}
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
                                    Update
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
                </ReactModal>
            </div>
        );
    } else if (attr == 'publisher') {
        const [publisher, setPublisher] = useState(props.publisher);
        const [name, setName] = useState(publisher.name || '');
        const [establishedYear, setEstablishedYear] = useState(publisher.establishedYear || '');
        const [location, setDateOfBirth] = useState(publisher.location || '');
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const [editPublisher] = useMutation(queries.EDIT_PUBLISHER);
        const handleCloseEditModal = () => {
            setShowEditModal(false);
            setPublisher(null);

            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel='Edit Publisher'
                    style={customStyles}
                >
                    <Typography variant="h5" gutterBottom>
                        Edit
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
                        id='add-publisher'
                        onSubmit={async (e) => {
                            try {
                                e.preventDefault();
                                let nameF = document.getElementById('name');
                                let establishedYearF = document.getElementById('establishedYear');
                                let locationF = document.getElementById('location');
                                let nameVal = name;
                                let establishedYearVal = establishedYear;
                                let locationVal = location;
                                let errors = [];
                                let id = props.publisher._id;
                                // try {
                                //     id = validateId(id);
                                // } catch (err) {
                                //     errors.push(err);
                                // }
                                if (nameF) {
                                    try {
                                        nameVal = checkisValidName(nameF.value, 'Name');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (establishedYearF) {
                                    try {
                                        establishedYearVal = validateYear(establishedYearF.value);
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (locationF) {
                                    try {
                                        locationVal = checkisValidLocation(locationF.value, 'Location');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (errors.length > 0) {
                                    setError(true);
                                    setErrorMsg(errors.join('\n'));
                                    return;
                                }

                                await editPublisher({
                                    variables: {
                                        id: id,
                                        name: nameVal,
                                        establishedYear: parseInt(establishedYearVal),
                                        location: locationVal
                                    }
                                });

                                setShowEditModal(false);

                                alert('Publisher Updated');
                                props.handleClose();
                            } catch (e) {
                                setError(true);
                                setErrorMsg("Error editing publisher:" + e);
                            }
                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                id="name"
                                label="Name"
                                name="name"
                                defaultValue={publisher.name}
                                variant="outlined"
                                fullWidth
                                required
                            />

                            <TextField
                                id="establishedYear"
                                label="Established Year"
                                name="establishedYear"
                                defaultValue={publisher.establishedYear}
                                variant="outlined"
                                fullWidth
                                required
                                type='number'
                            />

                            <TextField
                                id="location"
                                label="Location"
                                name="location"
                                defaultValue={publisher.location}
                                variant="outlined"
                                fullWidth
                                required
                            />

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                >
                                    Update
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
                </ReactModal>
            </div>
        );
    } else if (attr == 'book') {
        const [book, setBook] = useState(props.book);
        const [title, setTitle] = useState(book.title || '');
        const [publicationDate, setPublicationDate] = useState(book.publicationDate || '');
        const [genre, setGenre] = useState(book.genre);
        const [authorId, setAuthorId] = useState(book.author._id);
        const [publisherId, setPublisherId] = useState(book.publisher._id);
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        //console.log('Book edit: ' + JSON.stringify(props.book));
        const [editBook] = useMutation(queries.EDIT_BOOK);
        let { data: authorData } = useQuery(queries.GET_AUTHORS);
        if (authorData) {
            var { authors } = authorData;
        }
        let { data: publisherData } = useQuery(queries.GET_PUBLISHERS);
        if (publisherData) {
            var { publishers } = publisherData;
        }
        let { data: genreData, loading: genreLoading } = useQuery(queries.GET_GENRE_ENUM);

        if (genreLoading) {
            console.log('Loading genres...');
        }

        let genres = [];
        if (genreData?.__type?.enumValues) {
            genres = genreData.__type.enumValues.map((genre) => genre.name);
        }
        //console.log('Book edit:  book.authorId:' + JSON.stringify(book.author._id));
        // const [authorId, setAuthorId] = useState(book.author._id);

        const handleAuthorChange = (event) => {
            setAuthorId(event.target.value);
        };

        // const [publisherId, setPublisherId] = useState(book.publisher._id);

        const handlePublisherChange = (event) => {
            setPublisherId(event.target.value);
        };

        //const [genre, setGenre] = useState(book.genre);

        const handleGenreChange = (event) => {
            setGenre(event.target.value);
        };

        const handleCloseEditModal = () => {
            setShowEditModal(false);
            setBook(null);

            props.handleClose();
        };

        return (
            <div>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel='Edit Book'
                    style={customStyles}
                >
                    <Typography variant="h5" gutterBottom>
                        Edit
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
                        id='add-book'
                        onSubmit={async (e) => {
                            try {
                                e.preventDefault();
                                let titleF = document.getElementById('title');
                                let publicationDateF = document.getElementById('publicationDate');
                                let titleVal = title;
                                let publicationDateVal = publicationDate;
                                let errors = [];
                                let id = props.book._id;
                                // try {
                                //     id = validateId(id);
                                // } catch (err) {
                                //     errors.push(err);
                                // }

                                if (titleF) {
                                    try {
                                        titleVal = checkisValidTitle(titleF.value, 'Title');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }
                                if (publicationDateF) {
                                    try {
                                        publicationDateVal = dob_mmddyyyy_format(publicationDateF.value);
                                        publicationDateVal = checkisValidDate(publicationDateVal, 'Publication Date');
                                        checkisValidPublicationDate(publicationDateVal, book.author.dateOfBirth);
                                        checkisValidPublication(publicationDateVal, book.publisher.establishedYear)
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }

                                if (errors.length > 0) {
                                    setError(true);
                                    setErrorMsg(errors.join('\n'));
                                    return;
                                }
                                await editBook({
                                    variables: {
                                        id: id,
                                        title: titleVal,
                                        publicationDate: publicationDateVal,
                                        genre: genre,
                                        authorId: authorId,
                                        publisherId: publisherId
                                    }
                                });
                                setShowEditModal(false);

                                alert('Book Updated');
                                props.handleClose();
                            } catch (e) {
                                setError(true);
                                setErrorMsg("Error editing author:" + e);
                            }
                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                id='title'
                                label="Title"
                                name="title"
                                defaultValue={book.title}
                                variant="outlined"
                                fullWidth
                                required
                            />

                            <TextField
                                id='publicationDate'
                                label="Publication Date"
                                name="publicationDate"
                                type="date"
                                defaultValue={dob_yyyymmdd_format(book.publicationDate)}
                                variant="outlined"
                                fullWidth
                                required
                            />
                            <FormControl fullWidth>
                                <InputLabel id="genre-label">Genre *</InputLabel>
                                <Select
                                    labelId="genre-label"
                                    id="genre"
                                    label="Genre"
                                    defaultValue={genre}
                                    value={genre}
                                    onChange={handleGenreChange}
                                >
                                    {genres &&
                                        genres.map((genre) => (
                                            <MenuItem key={genre} value={genre}>
                                                {genre.replace('_', ' ')}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="authorId-label">Author *</InputLabel>
                                <Select
                                    labelId="authorId-label"
                                    id="authorId"
                                    label="Author"
                                    defaultValue={authorId}
                                    value={authorId}
                                    onChange={handleAuthorChange}
                                >
                                    {authors &&
                                        authors.map((author) => (
                                            <MenuItem key={author._id} value={author._id}>
                                                {author.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel id="publisherId-label">Publisher *</InputLabel>
                                <Select
                                    labelId="publisherId-label"
                                    id="publisherId"
                                    label="Publisher"
                                    defaultValue={publisherId}
                                    value={publisherId}
                                    onChange={handlePublisherChange}
                                >
                                    {publishers &&
                                        publishers.map((publisher) => (
                                            <MenuItem key={publisher._id} value={publisher._id}>
                                                {publisher.name}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                >
                                    Update
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
                </ReactModal>
            </div>
        );
    } else if (attr == 'chapter') {
        const [chapter, setChapter] = useState(props.chapter);
        const [title, setTitle] = useState(chapter.title || '');
        const [bookId, setBookId] = useState(chapter.book._id);
        const [error, setError] = useState(false);
        const [errorMsg, setErrorMsg] = useState('');
        const [editChapter] = useMutation(queries.EDIT_CHAPTER);
        let { data: bookData } = useQuery(queries.GET_BOOKS);
        if (bookData) {
            var { books } = bookData;
        }

        // const [bookId, setBookId] = useState(chapter.book._id);

        const handleBookChange = (event) => {
            setBookId(event.target.value);
        };

        const handleCloseEditModal = () => {
            setShowEditModal(false);
            setChapter(null);

            props.handleClose();
        };

        // let title;
        // let bookId;

        return (
            <div>
                <ReactModal
                    name='editModal'
                    isOpen={showEditModal}
                    contentLabel='Edit Chapter'
                    style={customStyles}
                >
                    <Typography variant="h5" gutterBottom>
                        Edit Chapter
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
                        id='add-chapter'
                        onSubmit={async (e) => {
                            try {
                                e.preventDefault();
                                let titleF = document.getElementById('title');
                                let titleVal = title;
                                let errors = [];
                                let id = props.chapter._id;
                                // try {
                                //     id = validateId(id);
                                // } catch (err) {
                                //     errors.push(err);
                                // }

                                if (titleF) {
                                    try {
                                        titleVal = checkisValidTitle(titleF.value, 'Title');
                                    } catch (err) {
                                        errors.push(err);
                                    }
                                }

                                if (errors.length > 0) {
                                    setError(true);
                                    setErrorMsg(errors.join('\n'));
                                    return;
                                }
                                await editChapter({
                                    variables: {
                                        id: id,
                                        title: titleVal,
                                        bookId: bookId
                                    }
                                });

                                setShowEditModal(false);

                                alert('Chapter Updated');
                                props.handleClose();
                            } catch (e) {
                                setError(true);
                                setErrorMsg("Error editing author:" + e);
                            }
                        }}
                    >
                        <Box display="flex" flexDirection="column" gap={3}>
                            <TextField
                                id='title'
                                label="Title"
                                name="title"
                                defaultValue={chapter.title}
                                variant="outlined"
                                fullWidth
                                required
                            />

                            <FormControl fullWidth>
                                <InputLabel id="bookId-label">Book *</InputLabel>
                                <Select
                                    labelId="bookId-label"
                                    id="bookId"
                                    label="Book"
                                    defaultValue={bookId}
                                    value={bookId}
                                    onChange={handleBookChange}
                                >
                                    {books &&
                                        books.map((book) => (
                                            <MenuItem key={book._id} value={book._id}>
                                                {book.title}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    type="submit"
                                >
                                    Update Chapter
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
                </ReactModal>
            </div>
        );
    }


}

export default EditModal;