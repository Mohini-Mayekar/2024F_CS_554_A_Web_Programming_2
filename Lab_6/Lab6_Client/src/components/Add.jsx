import React, { useState } from 'react';


import { useMutation, useQuery } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';
import { Button, Typography, Box, TextField, Card, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
// import { dob_mmddyyyy_format } from '../helper.jsx';
import { useNavigate } from 'react-router-dom';

import {
  dob_mmddyyyy_format, validateRange, ifExist, cacheData, throwError, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, deleteFromCache, validateId,
  checkisValidDate, checkisValidName, checkisValidString, checkisValidLocation, updatePublisher, updateAuthor,
  removeIdFromArray, updateBook, checkisValidTitle, validateUniqueChapters, validateYear, clearCache, checkisValidPublicationDate, checkisValidPublication,
  deleteKeyMatches
} from '../helper.jsx';

function Add(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [addAuthor] = useMutation(queries.ADD_AUTHOR
    , {
      update(cache, { data: { addAuthor } }) {
        const { authors: authors } = cache.readQuery({
          query: queries.GET_AUTHORS
        });
        cache.writeQuery({
          query: queries.GET_AUTHORS,
          data: { authors: [...authors, addAuthor] }
        });
      }
    }
  );

  const [addPublisher] = useMutation(queries.ADD_PUBLISHER
    , {
      update(cache, { data: { addPublisher } }) {
        const { publishers: publishers } = cache.readQuery({
          query: queries.GET_PUBLISHERS
        });
        cache.writeQuery({
          query: queries.GET_PUBLISHERS,
          data: { publishers: [...publishers, addPublisher] }
        });
      }
    }
  );

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

  const [authorId, setAuthorId] = useState('');
  const [authData, setAuthData] = useState('');

  const handleAuthorChange = (event) => {
    setAuthorId(event.target.value);

  };

  const [publisherId, setPublisherId] = useState('');
  const [pubData, setPubData] = useState('');

  const handlePublisherChange = (event) => {
    setPublisherId(event.target.value);
  };


  const [genre, setGenre] = useState('');

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const [addBook] = useMutation(queries.ADD_BOOK
    , {
      update(cache, { data: { addBook } }) {
        const { books: books } = cache.readQuery({
          query: queries.GET_BOOKS
        });
        cache.writeQuery({
          query: queries.GET_BOOKS,
          data: { books: [...books, addBook] }
        });
      }
    }
  );

  const [bookId, setBookId] = useState(props.bookId);


  const [addChapter] = useMutation(queries.ADD_CHAPTER, {
    update(cache, { data: { addChapter } }) {

      const existingData = cache.readQuery({
        query: queries.GET_CHAPTERS_BY_BOOK_ID,
        variables: { bookId: bookId },
      });

      const existingChapters = existingData?.getChaptersByBookId || [];

      cache.writeQuery({
        query: queries.GET_CHAPTERS_BY_BOOK_ID,
        variables: { bookId: bookId },
        data: {
          getChaptersByBookId: [...existingChapters, addChapter],
        },
      });
    },
  });

  const onSubmitAuthor = async (e) => {
    try {
      e.preventDefault();
      let name = document.getElementById('name');
      let bio = document.getElementById('bio');
      let dateOfBirth = document.getElementById('dateOfBirth');
      let nameVal;
      let bioVal;
      let dateOfBirthVal;
      let errors = [];
      if (name) {
        try {
          nameVal = checkisValidName(name.value, 'Name');
        } catch (err) {
          errors.push(err);
        }
      }
      if (bio) {
        try {
          bioVal = checkisValidString(bio.value, 'Bio');
        } catch (err) {
          errors.push(err);
        }
      }
      if (dateOfBirth) {
        try {
          //alert('dob: ' + dob_mmddyyyy_format(dateOfBirth.value))
          dateOfBirthVal = dob_mmddyyyy_format(dateOfBirth.value);
          //alert('dob.val: ' + dateOfBirthVal)
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
      //alert(dateOfBirth.value);
      // alert('dob: ' + dob_mmddyyyy_format(dateOfBirth.value))
      await addAuthor({
        variables: {
          name: nameVal,
          bio: bioVal,
          dateOfBirth: dateOfBirthVal
        }
      });
      document.getElementById('add-author').reset();
      setLoading(false);
      alert('Author Added');
      props.closeAddFormState();
    } catch (e) {
      setError(true);
      setErrorMsg("Error adding author:" + e);
    }
  };

  const onSubmitPublisher = async (e) => {
    try {
      e.preventDefault();
      let name = document.getElementById('name');
      let establishedYear = document.getElementById('establishedYear');
      let location = document.getElementById('location');
      let nameVal;
      let establishedYearVal;
      let locationVal;
      let errors = [];
      if (name) {
        try {
          nameVal = checkisValidName(name.value, 'Name');
        } catch (err) {
          errors.push(err);
        }
      }
      if (establishedYear) {
        try {
          establishedYearVal = validateYear(establishedYear.value);
        } catch (err) {
          errors.push(err);
        }
      }
      if (location) {
        try {
          locationVal = checkisValidLocation(location.value, 'Location');
        } catch (err) {
          errors.push(err);
        }
      }
      if (errors.length > 0) {
        setError(true);
        setErrorMsg(errors.join('\n'));
        return;
      }
      await addPublisher({
        variables: {
          name: nameVal,
          establishedYear: parseInt(establishedYearVal),
          location: locationVal
        }
      });
      document.getElementById('add-publisher').reset();
      alert('Publisher Added');
      props.closeAddFormState();
    } catch (e) {
      setError(true);
      setErrorMsg("Error adding publisher:" + e);
    }

  };

  const onSubmitBook = async (e) => {
    try {
      e.preventDefault();
      let title = document.getElementById('title');
      let publicationDate = document.getElementById('publicationDate');
      let titleVal;
      let publicationDateVal;
      let errors = [];
      if (title) {
        try {
          titleVal = checkisValidTitle(title.value, 'Title');
        } catch (err) {
          errors.push(err);
        }
      }

      if (publicationDate) {
        try {
          //alert('publicationDate: ' + dob_mmddyyyy_format(publicationDate.value))
          publicationDateVal = dob_mmddyyyy_format(publicationDate.value);
          //alert('publicationDate.val: ' + publicationDateVal)
          publicationDateVal = checkisValidDate(publicationDateVal, 'Publication Date');
          // checkisValidPublicationDate(publicationDateVal, authData.dateOfBirth);
          // checkisValidPublication(publicationDateVal, pubData.establishedYear);
        } catch (err) {
          errors.push(err);
        }
      }
      if (errors.length > 0) {
        setError(true);
        setErrorMsg(errors.join('\n'));
        return;
      }

      await addBook({
        variables: {
          title: titleVal,
          publicationDate: publicationDateVal,
          genre: genre,
          authorId: authorId,
          publisherId: publisherId
        }
      });
      document.getElementById('add-book').reset();
      alert('Book Added');
      props.closeAddFormState();
      //navigate('/books');
    } catch (e) {
      setError(true);
      const errorMessage = e.message ? e.message.replace('ApolloError: ', '') : e;
      setErrorMsg("Error adding book:" + errorMessage);
    }

  };

  const onSubmitChapter = async (e) => {
    try {
      e.preventDefault();
      let title = document.getElementById('title');
      let bookId = document.getElementById('bookId');
      console.log('Chapter Added bookId: ' + bookId.value);
      let titleVal;
      let errors = [];
      if (title) {
        try {
          titleVal = checkisValidTitle(title.value, 'Title');
        } catch (err) {
          errors.push(err);
        }
      }
      if (errors.length > 0) {
        setError(true);
        setErrorMsg(errors.join('\n'));
        return;
      }

      await addChapter({
        variables: {
          title: titleVal,
          bookId: bookId.value
        }
      });
      document.getElementById('add-chapter').reset();
      alert('Chapter Added');
      props.closeAddFormState();
    } catch (e) {
      setError(true);
      setErrorMsg("Error adding book:" + e);
    }
  };


  let body = null;
  if (props.type === 'author') {
    body = (

      <div className='card'>
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 500,
              padding: 3,
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <form id="add-author" onSubmit={onSubmitAuthor}>
              <Typography variant="h5" align="center" gutterBottom>
                Add Author
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

              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />
                <TextField
                  id="bio"
                  label="Bio"
                  variant="outlined"
                  fullWidth
                  multiline
                />
                <TextField
                  id="dateOfBirth"
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Add Author
                </Button>
                <Button
                  variant="outlined"
                  color="string"
                  fullWidth
                  sx={{ ml: 1 }}
                  onClick={() => {
                    document.getElementById('add-author').reset();
                    props.closeAddFormState();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </div>
    );
  } else if (props.type === 'publisher') {
    body = (

      <div className='card'>
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 500,
              padding: 3,
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <form id="add-publisher" onSubmit={onSubmitPublisher}>
              <Typography variant="h5" align="center" gutterBottom>
                Add Publisher
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
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />
                <TextField
                  id="establishedYear"
                  label="Established Year"
                  variant="outlined"
                  type="number"
                  fullWidth
                  multiline
                  required
                />
                <TextField
                  id="location"
                  label="Location"
                  variant="outlined"
                  fullWidth
                  required
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Add Publisher
                </Button>
                <Button
                  variant="outlined"
                  color="string"
                  fullWidth
                  sx={{ ml: 1 }}
                  onClick={() => {
                    document.getElementById('add-publisher').reset();
                    props.closeAddFormState();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </div>
    );
  } else if (props.type === 'book') {

    body = (

      <div className='card'>
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 500,
              padding: 3,
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <form id="add-book" onSubmit={onSubmitBook}>
              <Typography variant="h5" align="center" gutterBottom>
                Add
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
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  id="title"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />
                <TextField
                  id="publicationDate"
                  label="Publication Date"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
                <FormControl fullWidth>
                  <InputLabel id="genre-label">Genre *</InputLabel>
                  <Select
                    labelId="genre-label"
                    id="genre"
                    label="Genre"
                    defaultValue=""
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
                    defaultValue=""
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
                    defaultValue=""
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
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Add
                </Button>
                <Button
                  variant="outlined"
                  color="string"
                  fullWidth
                  sx={{ ml: 1 }}
                  onClick={() => {
                    document.getElementById('add-book').reset();
                    props.closeAddFormState();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </div>
    );
  } else if (props.type === 'chapter') {
    //let bookId = props.bookId;
    console.log('bookId:  ' + bookId);
    body = (

      <div className='card'>
        <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
          <Card
            sx={{
              width: '100%',
              maxWidth: 500,
              padding: 3,
              borderRadius: 2,
              boxShadow: 3
            }}
          >
            <form id="add-chapter" onSubmit={onSubmitChapter}>
              <Typography variant="h5" align="center" gutterBottom>
                Add Chapter
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
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  id="title"
                  label="Title"
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />

                <TextField
                  id="bookId"
                  style={{ display: 'none' }}
                  value={bookId}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Add Chapter
                </Button>
                <Button
                  variant="outlined"
                  color="string"
                  fullWidth
                  sx={{ ml: 1 }}
                  onClick={() => {
                    document.getElementById('add-chapter').reset();
                    props.closeAddFormState();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </div>
    );
  }
  return <div>{body}</div>;
}

export default Add;
