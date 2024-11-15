import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import noImage from '../img/download.jpeg';
import { Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { OpenInNew, Twitter } from '@mui/icons-material';

function VenueDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getVenueById(id) {
            try {
                const response = await axios.get(
                    `${apiConfig.baseUrl}/venues/${id}?apikey=${apiConfig.apiKey}&locale=en-us`
                );
                setVenue(response.data);
                setLoading(false);
            }
            catch (e) {
                navigate('/404')
            }
        }
        getVenueById(id);
    }, [id, navigate]);

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if (!venue) return null;

        return (
            <div>
                <h2>Venue</h2>
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
                        title={venue.name}
                        sx={{
                            borderBottom: '1px solid #1e8678',
                            fontWeight: 'bold'
                        }}
                    />
                    <CardMedia
                        component='img'
                        image={
                            venue.images && venue.images[0].url
                                ? venue.images[0].url
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
                                    {venue && venue.description ? (
                                        <dd>{venue.description}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Additional Information:</dt>
                                    {venue && venue.additionalInfo ? (
                                        <dd>{venue.additionalInfo}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Book Tickets:</dt>
                                    {venue && venue.url ? (
                                        <dd>
                                            <a
                                                rel='noopener noreferrer'
                                                target='_blank'
                                                href={venue.url}
                                            >
                                                {venue.name} @Ticket Master
                                                <OpenInNew />
                                            </a>
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Street Address:</dt>
                                    {venue && venue.address && venue.address.line1 ? (
                                        <dd>{venue.address.line1}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>City:</dt>
                                    {venue && venue.city && venue.city.name ? (
                                        <dd>{venue.city.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>State:</dt>
                                    {venue && venue.state && venue.state.name ? (
                                        <dd>{venue.state.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Country:</dt>
                                    {venue && venue.country && venue.country.name ? (
                                        <dd>{venue.country.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Postal Code:</dt>
                                    {venue && venue.postalCode ? (
                                        <dd>{venue.postalCode}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Markets:</dt>
                                    {venue && venue.markets && venue.markets.length > 0 ? (
                                        <dd>
                                            {venue.markets.map((market) => (
                                                <li key={market.id}>{market.name}</li>
                                            ))}
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Accepted Payment Method:</dt>
                                    {venue && venue.boxOfficeInfo && venue.boxOfficeInfo.acceptedPaymentDetail ? (
                                        <dd>{venue.boxOfficeInfo.acceptedPaymentDetail}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                {/* <p>
                                    <dt className='title'>Open Hours Detail:</dt>
                                    {venue && venue.boxOfficeInfo && venue.boxOfficeInfo.openHoursDetail ? (
                                        <dd>{venue.boxOfficeInfo.openHoursDetail}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Contact Detail:</dt>
                                    {venue && venue.boxOfficeInfo && venue.boxOfficeInfo.phoneNumberDetail ? (
                                        <dd>{venue.boxOfficeInfo.phoneNumberDetail}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Note:</dt>
                                    {venue && venue.boxOfficeInfo && venue.boxOfficeInfo.willCallDetail ? (
                                        <dd>{venue.boxOfficeInfo.willCallDetail}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>General rule:</dt>
                                    {venue && venue.generalInfo && venue.generalInfo.generalRule ? (
                                        <dd>{venue.generalInfo.generalRule}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Child rule:</dt>
                                    {venue && venue.generalInfo && venue.generalInfo.childRule ? (
                                        <dd>{venue.generalInfo.childRule}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p> */}

                                <p>
                                    <dt className='twitterIcon'><Twitter />:</dt>

                                    {venue && venue.social && venue.social.twitter && venue.social.twitter.handle ? (
                                        <dd>{venue.social.twitter.handle}</dd>
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
            </div>
        );
    }
}

export default VenueDetail;
