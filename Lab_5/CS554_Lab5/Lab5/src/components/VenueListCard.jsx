import React from 'react';
import noImage from '../img/download.jpeg';
import { Link } from 'react-router-dom';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Typography
} from '@mui/material';

function VenueListCard({ venue }) {
    const regex = /(<([^>]+)>)/gi;
    return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={venue.id}>
            <Card
                variant='outlined'
                sx={{
                    maxWidth: 250,
                    height: 'auto',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    borderRadius: 5,
                    border: '1px solid #1e8678',
                    boxShadow:
                        '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
                }}
            >
                <CardActionArea>
                    <Link to={`/venues/${venue.id}`}>
                        <CardMedia
                            sx={{
                                height: '100%',
                                width: '100%'
                            }}
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
                                sx={{
                                    borderBottom: '1px solid #1e8678',
                                    fontWeight: 'bold'
                                }}
                                gutterBottom
                                variant='h6'
                                component='h3'
                            >
                                {venue.name}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                <span>Description: </span>
                                {venue && venue.description ? (
                                    (venue.description
                                        ? venue.description
                                        : 'N?A'
                                    )
                                ) : (
                                    'N/A'
                                )}
                                <br></br>

                                <span>City:</span>
                                {venue && venue.city && venue.city.name ? (
                                    <dd>{venue.city.name}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                                <br></br>
                                <span>State:</span>
                                {venue && venue.state && venue.state.name ? (
                                    <dd>{venue.state.name}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                                <br></br>
                                <span>More Info...</span>
                            </Typography>

                        </CardContent>
                    </Link>
                </CardActionArea>
            </Card>
        </Grid >
    );
}

export default VenueListCard;
