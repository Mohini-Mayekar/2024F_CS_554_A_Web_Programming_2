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

function EventListCard({ event }) {
  const regex = /(<([^>]+)>)/gi;
  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={event.id}>
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
          <Link to={`/events/${event.id}`}>
            <CardMedia
              sx={{
                height: '100%',
                width: '100%'
              }}
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
                sx={{
                  borderBottom: '1px solid #1e8678',
                  fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
              >
                {event.name}
              </Typography>
              <Typography variant='body2' color='textSecondary' component='p'>
                <span>Start Date: </span>
                {event && event.dates && event.dates.start ? (
                  (event.dates.start.dateTBD
                    ? 'TBD'
                    : (event.dates.start.dateTBA
                      ? 'TBA'
                      : `${event.dates.start.localDate}`
                    )
                  )
                ) : (
                  'N/A'
                )}

                <br></br>
                <span>Price Range: </span>
                {event && event.priceRanges && event.priceRanges.length >= 1 ? (
                  <span>
                    {event.priceRanges.map((priceRange) => {
                      if (event.priceRanges.length > 1)
                        return <li key={priceRange.type}>{priceRange.type} : ${priceRange.min} - ${priceRange.max} ${priceRange.currency},</li>;
                      return `${priceRange.type} : ${priceRange.min} - ${priceRange.max} ${priceRange.currency}`;
                    })}
                  </span>
                ) : (
                  'N/A'
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

export default EventListCard;
