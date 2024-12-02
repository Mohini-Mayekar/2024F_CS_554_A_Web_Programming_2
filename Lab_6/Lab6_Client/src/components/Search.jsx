import { Box, Button, Card, FormControl, InputLabel, ListItem, ListItemText, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import queries from '../queries';
import { useQuery } from "@apollo/client";
import SearchResults from "./SearchResults";
import {
    dob_mmddyyyy_format, validateRange, ifExist, cacheData, throwError, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, deleteFromCache, validateId,
    checkisValidDate, checkisValidName, checkisValidString, checkisValidLocation, updatePublisher, updateAuthor,
    removeIdFromArray, updateBook, checkisValidTitle, validateUniqueChapters, validateYear, clearCache, checkisValidPublicationDate, checkisValidPublication,
    deleteKeyMatches
} from '../helper.jsx';

function Search() {
    const [searchType, setSearchType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [minYear, setMinYear] = useState('');
    const [maxYear, setMaxYear] = useState('');
    const [searchExecuted, setSearchExecuted] = useState(false);
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [publishers, setPublishers] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { data: booksByGenre } = useQuery(queries.SEARCH_BOOKS_BY_GENRE
        , {
            variables: { genre: searchTerm },
            skip: !searchExecuted || searchType !== "booksByGenre"
            ,
            fetchPolicy: 'cache-and-network'
            ,
            onCompleted: () => {
                console.log("Query for SEARCH_BOOKS_BY_GENRE executed");
            }
        }
    );

    const { data: authorByName } = useQuery(queries.SEARCH_AUTHOR_BY_NAME
        , {
            variables: { searchTerm: searchTerm },
            skip: !searchExecuted || searchType !== "searchAuthorByName"
            ,
            fetchPolicy: 'cache-and-network'
            ,
            onCompleted: () => {
                console.log("Query for SEARCH_AUTHOR_BY_NAME executed");
            }
        }
    );

    const { data: bookByTitle } = useQuery(queries.SEARCH_BOOK_BY_TITLE
        , {
            variables: { searchTerm: searchTerm },
            skip: !searchExecuted || searchType !== "searchBookByTitle"
            ,
            fetchPolicy: 'cache-and-network',
            onCompleted: () => {
                console.log("Query for SEARCH_BOOK_BY_TITLE executed");
            }
        }
    );

    const { data: chapterByTitle } = useQuery(queries.SEARCH_CHAPTER_BY_TITLE
        , {
            variables: { searchTitleTerm: searchTerm },
            skip: !searchExecuted || searchType !== "searchChapterByTitle"
            ,
            fetchPolicy: 'cache-and-network',
            onCompleted: () => {
                console.log("Query for SEARCH_CHAPTER_BY_TITLE executed");
            }
        }
    );

    const { data: publishersByEstablishedYear } = useQuery(queries.SEARCH_PUBLISHERS_BY_ESTABLISHED_YEAR
        , {
            variables: {
                min: parseInt(minYear),
                max: parseInt(maxYear)
            },
            skip: !searchExecuted || searchType !== "publishersByEstablished"
            ,
            fetchPolicy: 'cache-and-network',
            onCompleted: () => {
                console.log("Query for SEARCH_PUBLISHERS_BY_ESTABLISHED_YEAR executed");
            }
        }
    );

    useEffect(() => {
        if (booksByGenre) {
            console.log("HERE 1");
            setBooks(booksByGenre.booksByGenre);
        }
        if (authorByName) {
            console.log("HERE 2");
            setAuthors(authorByName.searchAuthorByName);
        }
        if (bookByTitle) {
            console.log("HERE 3");
            setBooks(bookByTitle.searchBookByTitle);
        }
        if (chapterByTitle) {
            console.log("HERE 4");
            setChapters(chapterByTitle.searchChapterByTitle);
        }
        if (publishersByEstablishedYear) {
            console.log("HERE 5");
            setPublishers(publishersByEstablishedYear.publishersByEstablishedYear);
        }
    }, [
        booksByGenre,
        authorByName,
        bookByTitle,
        chapterByTitle,
        publishersByEstablishedYear,
    ]);


    const searchTypeData = [
        { "key": "booksByGenre", "value": "Books by Genre" },
        { "key": "searchAuthorByName", "value": "Author by Name" },
        { "key": "searchBookByTitle", "value": "Book by Title" },
        { "key": "publishersByEstablished", "value": "Publishers by Established Year" },
        { "key": "searchChapterByTitle", "value": "Chapter by Title" }
    ];

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchTerm('');
        setMinYear('');
        setMaxYear('');
        setBooks([]);
        setAuthors([]);
        setChapters([]);
        setPublishers([]);
    };

    const onSubmitSearch = async (e) => {
        try {
            e.preventDefault();
            setError(false);
            setErrorMsg('');
            console.log('searchType : ' + searchType);
            let searchTermData = document.getElementById('searchTerm');
            let minYearData = document.getElementById('minYear');
            let maxYearData = document.getElementById('maxYear');
            let searchTermDataVal;
            let errors = [];

            if (searchTermData) {
                try {
                    searchTermDataVal = checkisValidString(searchTermData.value, 'Search Term');
                } catch (err) {
                    errors.push(err);
                }
            }
            if (minYearData && maxYearData) {
                try {
                    validateRange(minYearData.value, maxYearData.value);
                } catch (err) {
                    errors.push(err);
                }
            }
            if (errors.length > 0) {
                setError(true);
                setErrorMsg(errors.join('\n'));
                return;
            }

            const currentSearchTerm = searchTermDataVal;
            const currentMinYear = minYearData ? minYearData.value : '';
            const currentMaxYear = maxYearData ? maxYearData.value : '';

            setSearchTerm(currentSearchTerm);
            setMinYear(currentMinYear);
            setMaxYear(currentMaxYear);

            console.log('searchTerm : ' + currentSearchTerm);
            console.log('minYear : ' + currentMinYear);
            console.log('maxYear : ' + currentMaxYear);

            if (currentSearchTerm === "publishersByEstablished") {
                if (parseInt(currentMinYear) > parseInt(currentMaxYear)) {
                    alert("Min year should be less than or equal to Max year.");
                    return;
                }
            }
            setSearchExecuted(true);
        } catch (e) {
            setError(true);
            setErrorMsg("Error adding author:" + e);
        }

    };

    return (
        <div>
            <h1>Search</h1>
            {error && <Typography
                variant="body1"
                align="center"
                gutterBottom
                className='errorMessage'
                style={{ whiteSpace: 'pre-line' }}
            >
                {errorMsg}
            </Typography>}
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
                    <form onSubmit={onSubmitSearch}>
                        <Box display="flex" flexDirection="column" gap={3}>
                            <FormControl fullWidth>
                                <InputLabel id="searchType-label">Search By *</InputLabel>
                                <Select
                                    labelId="searchType-label"
                                    id="searchType"
                                    label="Search Type"
                                    defaultValue=""
                                    onChange={handleSearchTypeChange}
                                >
                                    {searchTypeData &&
                                        searchTypeData.map((searchBy) => (
                                            <MenuItem key={searchBy.key} value={searchBy.key}>
                                                {searchBy.value}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            {searchType === "publishersByEstablished" ? (
                                <Box display="flex" flexDirection="column" gap={2}>
                                    <TextField
                                        id="minYear"
                                        name="minYear"
                                        label="Min Year"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        type="number"
                                    />
                                    <TextField
                                        id="maxYear"
                                        name="maxYear"
                                        label="Max Year"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        type="number"
                                    />
                                </Box>
                            ) : (
                                <Box>
                                    <TextField
                                        id='searchTerm'
                                        name="searchTerm"
                                        label="Search Term"
                                        variant="outlined"
                                        fullWidth
                                        required
                                    />
                                </Box>
                            )}

                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    sx={{ mr: 1 }}
                                >
                                    Search
                                </Button>
                            </Box>
                        </Box>

                    </form>
                </Card>
            </Box>

            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Results
                </Typography>

                {(searchType === "booksByGenre" || searchType === "searchBookByTitle") && (
                    <SearchResults data={books} type="books" titleField="title" />
                )}

                {searchType === "searchAuthorByName" && (
                    <SearchResults data={authors} type="authors" titleField="name" />
                )}

                {searchType === "publishersByEstablished" && (
                    <SearchResults data={publishers} type="publishers" titleField="name" />
                )}

                {searchType === "searchChapterByTitle" && (
                    <SearchResults data={chapters} type="chapters" titleField="title" />
                )}

            </Box>

        </div>
    );
}

export default Search;
