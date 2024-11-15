import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import VenueListCard from './VenueListCard';
import { Grid } from '@mui/material';
import BasicPagination from './BasicPagination';
import Search from './Search';

function VenuesList() {
    const { page } = useParams();
    const navigate = useNavigate();
    const [venues, setVenues] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [size, setSize] = useState(20);
    const [totalElements, setTotalElements] = useState(20);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');
    let cardsData = null;
    let attr = 'venues';

    useEffect(() => {
        async function getVenues(page) {
            try {
                setError(false);
                let searchVal = searchTerm ? searchTerm.trim() : '';
                const response = await axios.get(
                    `${apiConfig.baseUrl}/venues?apikey=${apiConfig.apiKey}&countryCode=US&page=${page - 1}&keyword=${searchVal}`
                );
                setVenues(response.data._embedded.venues);
                setTotalPages(response.data.page.totalPages);
                setSize(response.data.page.size);
                setTotalElements(response.data.page.totalElements);
                setLoading(false);
            }
            catch (e) {
                setError(true);
                //navigate('/404')
            }
        }
        getVenues(page);
    }, [page, searchTerm]);

    const searchValue = async (value) => {
        if (value.length > 0 && value.trim() === '') {
            setSearchError('Search term cannot be just empty spaces.');
        } else {
            setSearchError('');
            setSearchTerm(value);
            navigate(`/venues/page/1`);
        }
    };

    cardsData =
        venues &&
        venues.map((venue) => {
            return <VenueListCard venue={venue} key={venue.id} />;
        });

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        return (
            <div>

                <h2>Venues</h2>
                <Search searchValue={searchValue} />
                <br />
                {searchError && <p className='errorMessage'>{searchError}</p>}
                <br />
                {!error ? (
                    <div>
                        <Grid
                            container
                            spacing={4}
                            sx={{
                                flexGrow: 1,
                                flexDirection: 'row'
                            }}
                        >
                            {cardsData}
                        </Grid>
                        <br></br>
                        <BasicPagination page={page} totalPages={totalPages} size={size} totalElements={totalElements} attr={attr} />
                        {/* <div>
                            <h5>Page {page} of {totalPages}    |   Items per page: {size}       |   Showing venues {((page - 1) * size) + 1} - {Math.min(page * size, totalElements)} of {totalElements}</h5>
                            {page > 1 && <button onClick={() => navigate(`/venues/page/${parseInt(page) - 1}`)}>Previous</button>}
                            {page < totalPages && <button onClick={() => navigate(`/venues/page/${parseInt(page) + 1}`)}>Next</button>}
                        </div> */}
                    </div>
                ) : (
                    <div>
                        <p>No Results Found</p>
                    </div>
                )}

                <br></br>
                <Link to='/'>Back to Home...</Link>
                <br></br>
                <br></br>
                <br></br>
            </div>
        );
    }
}

export default VenuesList;
