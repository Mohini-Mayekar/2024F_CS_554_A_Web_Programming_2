import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import { Grid } from '@mui/material';
import EventListCard from './EventListCard';
import Search from './Search';
import NotFound from './NotFound';
import BasicPagination from './BasicPagination';

function EventsList() {
    const { page } = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [size, setSize] = useState(20);
    const [totalElements, setTotalElements] = useState(20);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchError, setSearchError] = useState('');
    let cardsData = null;
    let attr = 'events';

    useEffect(() => {
        async function getEvents(page) {
            try {
                //setLoading(true);
                setError(false);
                //TO DO: validate input for empty value
                let searchVal = searchTerm ? searchTerm.trim() : '';
                console.log(searchVal);
                const response = await axios.get(
                    `${apiConfig.baseUrl}/events?apikey=${apiConfig.apiKey}&countryCode=US&page=${page - 1}&keyword=${searchVal}`
                );
                setEvents(response.data._embedded.events);
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
        getEvents(page);
    }, [page, searchTerm]);

    const searchValue = async (value) => {
        if (value.length > 0 && value.trim() === '') {
            setSearchError('Search term cannot be just empty spaces.');
        } else {
            setSearchError('');
            setSearchTerm(value);
            navigate(`/events/page/1`);
        }
    };

    cardsData =
        events &&
        events.map((event) => {
            return <EventListCard event={event} key={event.id} />;
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
                <h2>Events</h2>
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
                            <h5>Page {page} of {totalPages}    |   Items per page: {size}       |  Showing events {((page - 1) * size) + 1} - {Math.min(page * size, totalElements)} of {totalElements}</h5>
                            {page > 1 && <button onClick={() => navigate(`/events/page/${parseInt(page) - 1}`)}>Previous</button>}
                            {page < totalPages && <button onClick={() => navigate(`/events/page/${parseInt(page) + 1}`)}>Next</button>}

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
            </div >
        );
    }
}

export default EventsList;
