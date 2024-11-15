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

function AttractionListCard({ attraction }) {
    const regex = /(<([^>]+)>)/gi;
    return (
        <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={attraction.id}>
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
                    <Link to={`/attractions/${attraction.id}`}>
                        <CardMedia
                            sx={{
                                height: '100%',
                                width: '100%'
                            }}
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
                                sx={{
                                    borderBottom: '1px solid #1e8678',
                                    fontWeight: 'bold'
                                }}
                                gutterBottom
                                variant='h6'
                                component='h3'
                            >
                                {attraction.name}
                            </Typography>
                            <Typography variant='body2' color='textSecondary' component='p'>
                                <span>Description: </span>
                                {attraction && attraction.description ? (
                                    (attraction.description
                                        ? attraction.description
                                        : 'N?A'
                                    )
                                ) : (
                                    'N/A'
                                )}

                                <br></br>

                                <span>Segment:</span>
                                {attraction && attraction.classifications && attraction.classifications[0].segment && attraction.classifications[0].segment.name ? (
                                    <dd>{attraction.classifications[0].segment.name}</dd>
                                ) : (
                                    <dd>N/A</dd>
                                )}
                                <br></br>
                                <span>Genre:</span>
                                {attraction && attraction.classifications && attraction.classifications[0].genre && attraction.classifications[0].genre.name ? (
                                    <dd>{attraction.classifications[0].genre.name}</dd>
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

export default AttractionListCard;
