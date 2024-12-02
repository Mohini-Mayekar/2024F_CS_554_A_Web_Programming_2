import { gql } from '@apollo/client';

const GET_AUTHORS = gql`
  query {
    authors {
        _id
        name
        bio
        dateOfBirth
        numOfBooks
        books {
            _id
            title
            publicationDate
            genre
            chapters {
                _id
                title
            }
        }
    }
  }
`;

const GET_AUTHOR_BY_ID = gql`
    query getAuthorById($id: String!) {
        getAuthorById(_id: $id) {
            _id
            name
            bio
            dateOfBirth
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
                chapters {
                    _id
                    title
                }
            }
        }
    }
`;

const ADD_AUTHOR = gql`
  mutation addAuthor($name: String!, $dateOfBirth: String!, $bio: String) {
    addAuthor(name: $name, dateOfBirth: $dateOfBirth, bio: $bio) {
        _id
        name
        bio
        dateOfBirth
        numOfBooks
        books {
            _id
            title
            publicationDate
            genre
            chapters {
                _id
                title
            }
        }
    }
}
`;

const EDIT_AUTHOR = gql`
    mutation editAuthor($id: String!, $name: String, $bio: String, $dateOfBirth: String) {
        editAuthor(_id: $id, name: $name, bio: $bio, dateOfBirth: $dateOfBirth) {
            _id
            name
            bio
            dateOfBirth
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
                chapters {
                    _id
                    title
                }
            }
        }   
    }
`;
const DELETE_AUTHOR = gql`
    mutation removeAuthor($id: String!) {
        removeAuthor(_id: $id) {
            _id
            name
            bio
            dateOfBirth
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
                chapters {
                    _id
                    title
                }
            }
        }
    }
`;

const GET_PUBLISHERS = gql`
  query {
     publishers{
        _id
        name
        establishedYear
        location
        numOfBooks
        books {
            _id
            title
            publicationDate
            genre
            chapters {
                _id
                title
            }
        }
    }
  }
`;

const GET_PUBLISHER_BY_ID = gql`
    query getPublisherById($id: String!) {
        getPublisherById(_id: $id) {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
                chapters {
                    _id
                    title
                }
            }
        }
    }
`;

const ADD_PUBLISHER = gql`
    mutation addPublisher($name: String!, $establishedYear: Int!, $location: String!) {
        addPublisher(name: $name, establishedYear: $establishedYear, location: $location) {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
                chapters {
                    _id
                    title
                }
            }
        }
    }
`;
const EDIT_PUBLISHER = gql`
    mutation editPublisher($id: String!, $name: String, $establishedYear: Int, $location: String) {
        editPublisher(_id: $id, name: $name, establishedYear: $establishedYear, location: $location) {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
                chapters {
                    _id
                    title
                }
            }
        }
    }
`;
const DELETE_PUBLISHER = gql`
mutation removePublisher($id: String!) {
  removePublisher(_id: $id) {
    _id
    name
    establishedYear
    location
    numOfBooks
    books {
      _id
      title
      publicationDate
      genre
      chapters {
        _id
        title
      }      
    }
  }
}
`;

const GET_BOOKS = gql`
  query {
    books {
        _id
        title
        publicationDate
        genre
        chapters {
            _id
            title
        }
        author {
            _id
        }
        publisher {
            _id
        }
    }
  }
`;

const GET_BOOK_BY_ID = gql`
    query getBookById($id: String!) {
        getBookById(_id: $id) {
            _id
            title
            publicationDate
            genre
            chapters {
                _id
                title
            }
            author {
                _id
                name
                dateOfBirth                
            }
            publisher {
                _id
                name
                establishedYear            
            }
        }
    }
`;

const ADD_BOOK = gql`
    mutation addBook($title: String!, $publicationDate: String!, $genre: Genre!, $authorId: String!, $publisherId: String!) {
        addBook(title: $title, publicationDate: $publicationDate, genre: $genre, authorId: $authorId, publisherId: $publisherId) {
            _id
            title
            publicationDate
            genre
            author {
                _id
                name
                bio
                dateOfBirth
                numOfBooks
            }
            publisher {
                _id
                name
                establishedYear
                location
                numOfBooks
            }
            chapters {
                _id
                title
            }
        }
    }
`;

const EDIT_BOOK = gql`
    mutation editBook($id: String!, $title: String, $publicationDate: String, $genre: Genre, $authorId: String, $publisherId: String) {
        editBook(_id: $id, title: $title, publicationDate: $publicationDate, genre: $genre, authorId: $authorId, publisherId: $publisherId) {
            _id
            title
            publicationDate
            genre
            chapters {
                _id
                title
            }
            author {
                _id
                name
                bio
                dateOfBirth
                numOfBooks
            }
            publisher {
                _id
                name
                establishedYear
                location
                numOfBooks
            }
        }
    }
`;

const DELETE_BOOK = gql`
    mutation removeBook($id: String!) {
        removeBook(_id: $id) {
            _id
            title
            publicationDate
            genre
            chapters {
                _id
                title
            }
            author {
                _id
                name
                bio
                dateOfBirth
                numOfBooks
            }
            publisher {
                _id
                name
                establishedYear
                location
                numOfBooks
            }
        }
    }
`;

const GET_CHAPTERS_BY_BOOK_ID = gql`
    query getChaptersByBookId($bookId: String!) {
        getChaptersByBookId(bookId: $bookId) {
            _id
            title
            book {
                _id
                title                
            }
        }
    }
`;

const GET_CHAPTER_BY_ID = gql`
    query getChapterById($id: String!) {
        getChapterById(_id: $id) {
            _id
            title
            book {
                _id
                title
                publicationDate
                genre
                author {
                    _id
                    name
                    bio
                    dateOfBirth
                    numOfBooks
                }
                publisher {
                    _id
                    name
                    establishedYear
                    location
                    numOfBooks
                }
            }
        }
    }
`;

const ADD_CHAPTER = gql`
    mutation addChapter($title: String!, $bookId: String!) {
        addChapter(title: $title, bookId: $bookId) {
            _id
            title
            book {
                _id
                title
                publicationDate
                genre
            }
        }
    }
`;

const EDIT_CHAPTER = gql`
    mutation Mutation($id: String!, $title: String, $bookId: String) {
        editChapter(_id: $id, title: $title, bookId: $bookId) {
            _id
            title
            book {
                _id
                title
                publicationDate
                genre
            }
        }
    }

`;

const DELETE_CHAPTER = gql`
    mutation removeChapter($id: String!) {
        removeChapter(_id: $id) {
            _id
            title
            book {
                _id
                title
                publicationDate
                genre
                author {
                    _id
                    name
                    bio
                    dateOfBirth
                    numOfBooks
                }
                publisher {
                    _id
                    name
                    establishedYear
                    location
                    numOfBooks
                }
            }
        }
    }
`;

const GET_GENRE_ENUM = gql`
  query {
    __type(name: "Genre") {
      enumValues {
        name
      }
    }
  }
`;

const SEARCH_BOOKS_BY_GENRE = gql`
    query booksByGenre($genre: Genre!) {
        booksByGenre(genre: $genre) {
            _id
            title
            publicationDate
            genre
            author {
                _id
                name
                bio
                dateOfBirth
                numOfBooks
            }
            publisher {
                _id
                name
                establishedYear
                location
                numOfBooks
            }
            chapters {
                _id
                title
            }
        }
    }
`;

const SEARCH_PUBLISHERS_BY_ESTABLISHED_YEAR = gql`
    query publishersByEstablishedYear($min: Int!, $max: Int!) {
        publishersByEstablishedYear(min: $min, max: $max) {
            _id
            name
            establishedYear
            location
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
            }
        }
    }
`;

const SEARCH_AUTHOR_BY_NAME = gql`
    query searchAuthorByName($searchTerm: String!) {
        searchAuthorByName(searchTerm: $searchTerm) {
            _id
            name
            bio
            dateOfBirth
            numOfBooks
            books {
                _id
                title
                publicationDate
                genre
            }
        }
    }
`;

const SEARCH_BOOK_BY_TITLE = gql`
    query searchBookByTitle($searchTerm: String!) {
        searchBookByTitle(searchTerm: $searchTerm) {
            _id
            title
            publicationDate
            genre
            author {
                _id
                name
                bio
                dateOfBirth
                numOfBooks
            }
            publisher {
                _id
                name
                establishedYear
                location
                numOfBooks
            }
            chapters {
                _id
                title
            }
        }
    }
`;

const SEARCH_CHAPTER_BY_TITLE = gql`
    query searchChapterByTitle($searchTitleTerm: String!) {
        searchChapterByTitle(searchTitleTerm: $searchTitleTerm) {
            _id
            title
            book {
                _id
                title
                publicationDate
                genre
            }
        }
    }
`;

const exported = {
    GET_AUTHORS,
    GET_AUTHOR_BY_ID,
    ADD_AUTHOR,
    EDIT_AUTHOR,
    DELETE_AUTHOR,
    GET_PUBLISHERS,
    GET_PUBLISHER_BY_ID,
    ADD_PUBLISHER,
    EDIT_PUBLISHER,
    DELETE_PUBLISHER,
    GET_BOOKS,
    GET_BOOK_BY_ID,
    ADD_BOOK,
    EDIT_BOOK,
    DELETE_BOOK,
    GET_CHAPTERS_BY_BOOK_ID,
    GET_CHAPTER_BY_ID,
    ADD_CHAPTER,
    EDIT_CHAPTER,
    DELETE_CHAPTER,
    GET_GENRE_ENUM,
    SEARCH_BOOKS_BY_GENRE,
    SEARCH_PUBLISHERS_BY_ESTABLISHED_YEAR,
    SEARCH_AUTHOR_BY_NAME,
    SEARCH_BOOK_BY_TITLE,
    SEARCH_CHAPTER_BY_TITLE
};

export default exported;