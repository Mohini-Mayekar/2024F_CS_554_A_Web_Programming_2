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

function EventListCard({ author }) {
  const regex = /(<([^>]+)>)/gi;
  return (
    <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={author._id}>
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
          <CardContent>
            <Link to={`/authors/${author._id}`}>
              <Typography
                sx={{
                  borderBottom: '1px solid #1e8678',
                  fontWeight: 'bold'
                }}
                gutterBottom
                variant='h6'
                component='h3'
              >
                {author.name}
              </Typography>
            </Link>
            <Typography variant='body2' color='textSecondary' component='p'>
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 1, mr: 1 }}
                onClick={() => handleOpenEditModal(author)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => handleOpenDeleteModal(author)}
              >
                Delete
              </Button>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid >
  );
}

export default EventListCard;
