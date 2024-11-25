import React from 'react';


import { useQuery, useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';
import { Button, Typography, Box, TextField, Card } from '@mui/material';

function Add(props) {
  const [addAuthor] = useMutation(queries.ADD_AUTHOR, {
    update(cache, { data: { addAuthor } }) {
      const { authors: authors } = cache.readQuery({
        query: queries.GET_AUTHORS
      });
      cache.writeQuery({
        query: queries.GET_AUTHORS,
        data: { authors: [...authors, addAuthor] }
      });
    }
  });


  const onSubmitAuthor = (e) => {
    e.preventDefault();
    let name = document.getElementById('name');
    let bio = document.getElementById('bio');
    let dateOfBirth = document.getElementById('dateOfBirth');
    addAuthor({
      variables: {
        name: name.value,
        bio: bio.value,
        dateOfBirth: dateOfBirth.value
      }
    });
    document.getElementById('add-author').reset();
    alert('Author Added');
    props.closeAddFormState();
  };


  let body = null;
  if (props.type === 'author') {
    body = (

      <div className='card'>
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
            <form id="add-author" onSubmit={onSubmitAuthor}>
              <Typography variant="h5" align="center" gutterBottom>
                Add Author
              </Typography>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                />
                <TextField
                  id="bio"
                  label="Bio"
                  variant="outlined"
                  fullWidth
                  multiline
                />
                <TextField
                  id="dateOfBirth"
                  label="Date of Birth"
                  variant="outlined"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  sx={{ mr: 1 }}
                >
                  Add Author
                </Button>
                <Button
                  variant="outlined"
                  color="string"
                  fullWidth
                  sx={{ ml: 1 }}
                  onClick={() => {
                    document.getElementById('add-author').reset();
                    props.closeAddFormState();
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Card>
        </Box>
      </div>
    );
  }
  // else if (props.type === 'employer') {
  //   let name;
  //   body = (
  //     <div className='card'>
  //       <form className='form' id='add-employer' onSubmit={onSubmitEmployer}>
  //         <div className='form-group'>
  //           <label>
  //             Employer Name:
  //             <br />
  //             <input id='employerName' required autoFocus={true} />
  //           </label>
  //         </div>
  //         <br />

  //         <br />
  //         <br />
  //         <button className='button' type='submit'>
  //           Add Employer
  //         </button>
  //         <button
  //           type='button'
  //           className='button'
  //           onClick={() => {
  //             document.getElementById('add-employer').reset();
  //             props.closeAddFormState();
  //           }}
  //         >
  //           Cancel
  //         </button>
  //       </form>
  //     </div>
  //   );
  // }
  return <div>{body}</div>;
}

export default Add;
