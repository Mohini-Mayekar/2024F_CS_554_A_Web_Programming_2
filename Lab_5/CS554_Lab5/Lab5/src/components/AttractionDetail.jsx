import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { apiConfig } from '../api/ApiConfig'
import { Card, CardContent, CardHeader, CardMedia, Typography } from '@mui/material';
import { Facebook, Instagram, YouTube, Twitter, HomeOutlined, Web, OpenInNew, Public, Language } from '@mui/icons-material';

function AttractionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [attraction, setAttraction] = useState(null);
    const [loading, setLoading] = useState(true);

    const hasExternalLinks =
        attraction &&
        attraction.externalLinks &&
        (attraction.externalLinks.youtube ||
            attraction.externalLinks.facebook ||
            attraction.externalLinks.instagram ||
            attraction.externalLinks.twitter ||
            attraction.externalLinks.homepage);

    useEffect(() => {
        async function getAttractionsById(id) {
            try {
                const response = await axios.get(
                    `${apiConfig.baseUrl}/attractions/${id}?apikey=${apiConfig.apiKey}&locale=en-us`
                );
                setAttraction(response.data);
                setLoading(false);
            }
            catch (e) {
                navigate('/404')
            }
        }
        getAttractionsById(id);
    }, [id, navigate]);

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if (!attraction) return null;

        return (
            <div>
                <h2>Attraction</h2>
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
                        title={attraction.name}
                        sx={{
                            borderBottom: '1px solid #1e8678',
                            fontWeight: 'bold'
                        }}
                    />
                    <CardMedia
                        component='img'
                        image={
                            attraction.images && attraction.images[0].url
                                ? attraction.images[0].url
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
                                    {attraction && attraction.description ? (
                                        <dd>{attraction.description}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Additional Information:</dt>
                                    {attraction && attraction.additionalInfo ? (
                                        <dd>{attraction.additionalInfo}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Book Tickets:</dt>
                                    {attraction && attraction.url ? (
                                        <dd>
                                            <a
                                                rel='noopener noreferrer'
                                                target='_blank'
                                                href={attraction.url}
                                            >
                                                {attraction.name} @Ticket Master
                                                <OpenInNew />
                                            </a>
                                        </dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Segment:</dt>
                                    {attraction && attraction.classifications && attraction.classifications[0].segment && attraction.classifications[0].segment.name ? (
                                        <dd>{attraction.classifications[0].segment.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Genre:</dt>
                                    {attraction && attraction.classifications && attraction.classifications[0].genre && attraction.classifications[0].genre.name ? (
                                        <dd>{attraction.classifications[0].genre.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Sub-Genre:</dt>
                                    {attraction && attraction.classifications && attraction.classifications[0].subGenre && attraction.classifications[0].subGenre.name ? (
                                        <dd>{attraction.classifications[0].subGenre.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Type:</dt>
                                    {attraction && attraction.classifications && attraction.classifications[0].type && attraction.classifications[0].type.name ? (
                                        <dd>{attraction.classifications[0].type.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>

                                <p>
                                    <dt className='title'>Sub-Type:</dt>
                                    {attraction && attraction.classifications && attraction.classifications[0].subType && attraction.classifications[0].subType.name ? (
                                        <dd>{attraction.classifications[0].subType.name}</dd>
                                    ) : (
                                        <dd>N/A</dd>
                                    )}
                                </p>
                                <p>
                                    <dt className='title'>External Links:</dt>
                                    {hasExternalLinks ? (
                                        <>
                                            {attraction && attraction.externalLinks && attraction.externalLinks.youtube && (
                                                <dd>
                                                    <a
                                                        className='youtubeIcon'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        href={attraction.externalLinks.youtube[0].url}
                                                    >
                                                        <YouTube />
                                                    </a>
                                                </dd>
                                            )}

                                            {attraction && attraction.externalLinks && attraction.externalLinks.facebook && (
                                                <dd>
                                                    <a
                                                        className='facebookIcon'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        href={attraction.externalLinks.facebook[0].url}
                                                    >
                                                        <Facebook />
                                                    </a>
                                                </dd>
                                            )}

                                            {attraction && attraction.externalLinks && attraction.externalLinks.instagram && (
                                                <dd>
                                                    <a
                                                        className='instagramIcon'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        href={attraction.externalLinks.instagram[0].url}
                                                    >
                                                        <Instagram />
                                                    </a>
                                                </dd>
                                            )}

                                            {attraction && attraction.externalLinks && attraction.externalLinks.twitter && (
                                                <dd>
                                                    <a
                                                        className='twitterIcon'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        href={attraction.externalLinks.twitter[0].url}
                                                    >
                                                        <Twitter />
                                                    </a>
                                                </dd>
                                            )}

                                            {attraction && attraction.externalLinks && attraction.externalLinks.homepage && (
                                                <dd>
                                                    <a
                                                        className='instagramIcon'
                                                        rel='noopener noreferrer'
                                                        target='_blank'
                                                        href={attraction.externalLinks.homepage[0].url}
                                                    >
                                                        <Language />
                                                    </a>
                                                </dd>
                                            )}
                                        </>
                                    ) :
                                        <dd>N/A</dd>
                                    }
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

export default AttractionDetail;
