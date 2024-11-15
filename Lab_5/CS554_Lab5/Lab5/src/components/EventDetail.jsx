import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import { Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { OpenInNew, Link as LinkIcon } from '@mui/icons-material';


function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getEventById(id) {
            try {
                const response = await axios.get(
                    `${apiConfig.baseUrl}/events/${id}?apikey=${apiConfig.apiKey}&locale=en-us`
                );
                setEvent(response.data);
                setLoading(false);
            }
            catch (e) {
                navigate('/404')
            }
        }
        getEventById(id);
        // getEventById(id)
        //     .then((response) => setEvent(response.data))
        //     .catch(() => navigate('/404'));
    }, [id, navigate]);

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if (!event) return null;

        return (

            <div>
                <h2>Event</h2>
                <Card
                    variant='outlined'
                    sx={{
                        maxWidth: 550,
                        height: 'auto',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        borderRadius: 5,
                        border: '1px solid #1e8678',
                        boxShadow:
                            '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                    }}
                >
                    <CardHeader
                        title={event.name}
                        sx={{
                            borderBottom: '1px solid #1e8678',
                            fontWeight: 'bold'
                        }}
                    />
                    <CardMedia
                        component='img'
                        image={
                            event.images && event.images[0].url
                                ? event.images[0].url
                                : noImage
                        }
                        title='show image'
                    />

                    <CardContent>
                        <Typography
                            variant='body2'
                            color='textSecondary'
                            component='span'
                            sx={{
                                borderBottom: '1px solid #1e8678',
                                fontWeight: 'bold'
                            }}
                        >
                            <dl>
                                <p>
                                    <dt className='title'>Description:</dt>
                                    {event && event.description ? (
                                        <dd>{event.description}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Information:</dt>
                                    {event && event.info ? (
                                        <dd>{event.info}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Additional Information:</dt>
                                    {event && event.additionalInfo ? (
                                        <dd>{event.additionalInfo}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Segment:</dt>
                                    {event && event.classifications && event.classifications[0].segment && event.classifications[0].segment.name ? (
                                        <dd>{event.classifications[0].segment.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Genre:</dt>
                                    {event && event.classifications && event.classifications[0].genre && event.classifications[0].genre.name ? (
                                        <dd>{event.classifications[0].genre.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Sub-Genre:</dt>
                                    {event && event.classifications && event.classifications[0].subGenre && event.classifications[0].subGenre.name ? (
                                        <dd>{event.classifications[0].subGenre.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Type:</dt>
                                    {event && event.classifications && event.classifications[0].type && event.classifications[0].type.name ? (
                                        <dd>{event.classifications[0].type.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Sub-Type:</dt>
                                    {event && event.classifications && event.classifications[0].subType && event.classifications[0].subType.name ? (
                                        <dd>{event.classifications[0].subType.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                {/* <p>
                                    <dt className='title'>Sale start date time:</dt>
                                    {event &&
                                        event.sales.public && event.sales.public &&
                                        event.sales.public.startDateTime ? (
                                        <dd>{event.sales.public.startDateTime}</dd>
                                    ) : (
                                        <dd>TBD</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Sale end date time:</dt>
                                    {event &&
                                        event.sales.public && event.sales.public &&
                                        event.sales.public.endDateTime ? (
                                        <dd>{event.sales.public.endDateTime}</dd>
                                    ) : (
                                        <dd>TBD</dd>
                                    )}
                                </p> */}
                                <p>
                                    <dt className='title'>Book Tickets:</dt>
                                    {event && event.url ? (
                                        <dd>
                                            <a
                                                rel='noopener noreferrer'
                                                target='_blank'
                                                href={event.url}
                                            >
                                                {event.name} @Ticket Master
                                                <OpenInNew />
                                            </a>
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Timezone:</dt>
                                    {event && event.dates && event.dates.timezone ? (
                                        <dd>{event.dates.timezone}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                {/* <p>
                                    <dt className='title'>Start date time:</dt>
                                    {event &&
                                        event.dates && event.dates.start &&
                                        event.dates.start.dateTime ? (
                                        <dd>{event.dates.start.dateTime}</dd>
                                    ) : (
                                        <dd>TBD</dd>
                                    )}
                                </p> */}



                                <p>
                                    <dt className='title'>Start Date:</dt>
                                    {event && event.dates && event.dates.start ? (
                                        (event.dates.start.dateTBD
                                            ? <dd>TBD</dd>
                                            : (event.dates.start.dateTBA
                                                ? <dd>TBA</dd>
                                                : <dd>{event.dates.start.localDate}</dd>
                                            )
                                        )
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                {/* <p>
                                    <dt className='title'>Start Time:</dt>
                                    {event && event.dates && event.dates.start ? (
                                        (event.dates.start.timeTBA
                                            ? <dd>TBA</dd>
                                            : (event.dates.start.noSpecificTime
                                                ? <dd>No specific time</dd>
                                                : (event.dates.start.localTime
                                                    ? (event.dates.start.localTime.hourOfDay && event.dates.start.localTime.minuteOfHour
                                                        ? <dd>{event.dates.start.localTime.hourOfDay} :{event.dates.start.localTime.minuteOfHour}</dd>
                                                        : <dd>N/A</dd>)
                                                    : <dd>N/A</dd>
                                                )
                                            )
                                        )
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>End date time:</dt>
                                    {event &&
                                        event.dates && event.dates.end &&
                                        event.dates.end.dateTime ? (
                                        <dd>{event.dates.end.dateTime}</dd>
                                    ) : (
                                        <dd>TBD</dd>
                                    )}
                                </p> */}
                                <p>
                                    <dt className='title'>End Date:</dt>
                                    {event && event.dates && event.dates.end && event.dates.end.localDate
                                        ? <dd>{event.dates.end.localDate}</dd>
                                        : <dd>N/A</dd>
                                    }
                                </p>

                                {/* <p>
                                    <dt className='title'>End Time:</dt>
                                    {event && event.dates && event.dates.end ? (
                                        (event.dates.end.noSpecificTime
                                            ? <dd>No specific time</dd>
                                            : (event.dates.end.localTime
                                                ? (event.dates.end.localTime.hourOfDay && event.dates.end.localTime.minuteOfHour
                                                    ? <dd>{event.dates.end.localTime.hourOfDay} :{event.dates.end.localTime.minuteOfHour}</dd>
                                                    : <dd>N/A</dd>)
                                                : <dd>N/A</dd>
                                            )
                                        )
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p> */}

                                <p>
                                    <dt className='title'>Price Ranges:</dt>
                                    {event && event.priceRanges && event.priceRanges.length >= 1 ? (
                                        <span>
                                            {event.priceRanges.map((priceRange) => {
                                                if (event.priceRanges.length > 1)
                                                    return <dd>{priceRange.type} : {priceRange.min} - {priceRange.max} {priceRange.currency},</dd>;
                                                return <dd key={priceRange.type}>{priceRange.type} : {priceRange.min} - {priceRange.max} {priceRange.currency}</dd>;
                                            })}
                                        </span>

                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>Attractions:</dt>
                                    {event && event._embedded && event._embedded.attractions && event._embedded.attractions.length > 0 ? (
                                        <dd>
                                            {event._embedded.attractions.map((attraction) => (
                                                <li key={attraction.id}><Link className='sublink' to={`/attractions/${attraction.id}`}>{attraction.name}<LinkIcon /></Link></li>
                                            ))}
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Venues:</dt>
                                    {event && event._embedded && event._embedded.venues && event._embedded.venues.length > 0 ? (
                                        <dd>
                                            {event._embedded.venues.map((venue) => (
                                                <li key={venue.id}><Link className='sublink' to={`/venues/${venue.id}`}>{venue.name}<LinkIcon /></Link></li>
                                            ))}
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                            </dl>
                            <Link to='/'>Back to Home...</Link>
                        </Typography>
                    </CardContent>
                </Card>
                <br></br>
                <br></br>
            </div >
        );
    }
}

export default EventDetail;
