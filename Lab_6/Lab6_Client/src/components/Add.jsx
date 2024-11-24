import React from 'react';


import { useQuery, useMutation } from '@apollo/client';
//Import the file where my query constants are defined
import queries from '../queries';

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
        <form className='form' id='add-author' onSubmit={onSubmitAuthor}>
          <div className='form-group'>
            <label>
              Name:
              <br />
              <input id='name' required autoFocus={true} />
            </label>
          </div>
          <br />
          <div className='form-group'>
            <label>
              Bio:
              <br />
              <input id='bio' required />
            </label>
          </div>
          <br />

          <div className='form-group'>
            <label>
              Date of Birth:
              <br />
              <input id='dateOfBirth' required />
            </label>
          </div>

          <br />
          <br />
          <button className='button add-button' type='submit'>
            Add Author
          </button>
          <button
            type='button'
            className='button cancel-button'
            onClick={() => {
              document.getElementById('add-author').reset();
              props.closeAddFormState();
            }}
          >
            Cancel
          </button>
        </form>
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
