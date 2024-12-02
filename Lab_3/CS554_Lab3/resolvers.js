import { GraphQLError } from 'graphql';
import {
    validateRange, ifExist, cacheData, throwError, INTERNAL_SERVER_ERROR, NOT_FOUND, BAD_REQUEST, deleteFromCache, validateId,
    checkisValidDate, checkisValidName, checkisValidString, checkisValidLocation, updatePublisher, updateAuthor,
    removeIdFromArray, updateBook, checkisValidTitle, validateUniqueChapters, validateYear, clearCache, checkisValidPublicationDate, checkisValidPublication,
    deleteKeyMatches
} from './helpers.js';
import { ObjectId } from 'mongodb';
import redis from 'redis';
const client = redis.createClient();
client.connect().then(() => { });
import {
    authors as authorCollection,
    books as bookCollection,
    publishers as publisherCollection,
    chapters as chapterCollection
} from './config/mongoCollections.js';


import { v4 as uuid } from 'uuid'; //for generating _id's

/* parentValue - References the type def that called it
    so for example when we execute numOfEmployees we can reference
    the parent's properties with the parentValue Paramater
*/

/* args - Used for passing any arguments in from the client
    for example, when we call 
    addEmployee(firstName: String!, lastName: String!, employerId: Int!): Employee
    	
*/

export const resolvers = {
    Query: {
        authors: async () => {
            const authorsList = await ifExist('authors');
            if (authorsList) {
                return authorsList;
            }
            console.log('fetch');
            const authors = await authorCollection();
            const allAuthors = await authors.find({}).toArray();
            if (!allAuthors) {
                throwError(`Internal Server Error`, INTERNAL_SERVER_ERROR);
            }
            await cacheData('authors', allAuthors, 3600);
            return allAuthors;
        },
        books: async () => {
            const booksList = await ifExist('books');
            if (booksList) {
                return booksList;
            }
            console.log('fetch');
            const books = await bookCollection();
            const allBooks = await books.find({}).toArray();
            if (!allBooks) {
                throwError(`Internal Server Error`, INTERNAL_SERVER_ERROR);
            }
            await cacheData('books', allBooks, 3600);
            return allBooks;
        },
        publishers: async () => {
            const publishersList = await ifExist('publishers');
            if (publishersList) {
                return publishersList;
            }
            console.log('fetch');
            const publishers = await publisherCollection();
            const allPublishers = await publishers.find({}).toArray();
            if (!allPublishers) {
                throwError(`Internal Server Error`, INTERNAL_SERVER_ERROR);
            }
            await cacheData('publishers', allPublishers, 3600);
            return allPublishers;
        },
        getAuthorById: async (_, args) => {
            args._id = validateId(args._id, 'author id');
            const authorById = await ifExist('author:{' + args._id + '}');
            if (authorById) {
                return authorById;
            }
            console.log('fetch');
            const authors = await authorCollection();
            const author = await authors.findOne({ _id: new ObjectId(args._id) });
            if (!author) {
                throwError(`Author Not Found`, NOT_FOUND);
            }

            await cacheData('author:{' + args._id + '}', author);
            return author;
        },
        getBookById: async (_, args) => {
            args._id = validateId(args._id, 'book id');
            const bookById = await ifExist('book:{' + args._id + '}');
            if (bookById) {
                return bookById;
            }
            console.log('fetch');
            const books = await bookCollection();
            const book = await books.findOne({ _id: new ObjectId(args._id) });
            if (!book) {
                throwError(`Book Not Found`, NOT_FOUND);
            }
            await cacheData('book:{' + args._id + '}', book);
            return book;
        },
        getPublisherById: async (_, args) => {
            args._id = validateId(args._id, 'publisher id');
            const publisherById = await ifExist('publisher:{' + args._id + '}');
            if (publisherById) {
                return publisherById;
            }
            console.log('fetch');
            const publishers = await publisherCollection();
            const publisher = await publishers.findOne({ _id: new ObjectId(args._id) });
            if (!publisher) {
                throwError(`Publisher Not Found`, NOT_FOUND);
            }
            await cacheData('publisher:{' + args._id + '}', publisher);
            return publisher;
        },
        getChaptersByBookId: async (_, args) => {
            args.bookId = validateId(args.bookId, 'bookId id');
            /*  let chaptersByBookId = await ifExist('chapters:book:{' + args.bookId + '}');
              if (chaptersByBookId) {
                  return chaptersByBookId;
              }*/
            console.log('fetch');
            const chapter = await chapterCollection();
            const bookChapters = await chapter.find({ bookId: new ObjectId(args.bookId) }).toArray();
            if (!bookChapters) {
                throwError(`Book Not Found`, NOT_FOUND);
            }
            let chaptersByBookId = bookChapters ? bookChapters.chapters : [];
            // await cacheData('chapters:book:{' + args.bookId + '}', chaptersByBookId, 3600);
            return chaptersByBookId;
        },
        booksByGenre: async (_, args) => {
            const booksByGenre = await ifExist('genre:{' + args.genre + '}');
            if (booksByGenre) {
                return booksByGenre;
            }
            console.log('fetch');
            const books = await bookCollection();
            const booksList = await books.find({ genre: args.genre }).toArray();
            if (!booksList) {
                throwError(`No book found for the given genre`, NOT_FOUND);
            }
            await cacheData('genre:{' + args.genre + '}', booksList, 3600);
            return booksList;
        },
        publishersByEstablishedYear: async (_, args) => {
            validateRange(args.min, args.max);
            const publishersByYear = await ifExist('foundedYear:{' + args.min + '}:{' + args.max + '}');
            if (publishersByYear) {
                return publishersByYear;
            }
            console.log('fetch');
            const publishers = await publisherCollection();
            const publisher = await publishers.find({ establishedYear: { $gte: args.min, $lte: args.max } }).toArray();
            if (!publisher) {
                throwError(`No Publishers found for the given year range.`, NOT_FOUND);
            }
            await cacheData('foundedYear:{' + args.min + '}:{' + args.max + '}', publisher, 3600);
            return publisher;
        },
        searchAuthorByName: async (_, args) => {
            args.searchTerm = checkisValidString(args.searchTerm);
            const authorsByName = await ifExist('search:author:{' + args.searchTerm + '}');
            if (authorsByName) {
                return authorsByName;
            }
            console.log('fetch');
            const authors = await authorCollection();
            const author = await authors.find({ name: { $regex: args.searchTerm, $options: 'i' } }).toArray();
            if (!author) {
                throwError(`No author found for the given name.`, NOT_FOUND);
            }
            await cacheData('search:author:{' + args.searchTerm + '}', author, 3600);
            return author;
        },
        searchBookByTitle: async (_, args) => {
            args.searchTerm = checkisValidString(args.searchTerm);
            const booksByName = await ifExist('search:book:{' + args.searchTerm + '}');
            if (booksByName) {
                return booksByName;
            }
            console.log('fetch');
            const books = await bookCollection();
            const booksList = await books.find({ title: { $regex: args.searchTerm, $options: 'i' } }).toArray();
            if (!booksList) {
                throwError(`No book found for the given title.`, NOT_FOUND);
            }
            await cacheData('search:book:{' + args.searchTerm + '}', booksList, 3600);
            return booksList;
        },
        getChapterById: async (_, args) => {
            args._id = validateId(args._id, 'chapter id');
            /* const chapterById = await ifExist('chapter:{' + args._id + '}');
             if (chapterById) {
                 return chapterById;
             }*/
            console.log('fetch');
            const chapters = await chapterCollection();
            const chapter = await chapters.findOne({ _id: new ObjectId(args._id) });
            if (!chapter) {
                throwError(`Chapter Not Found`, NOT_FOUND);
            }
            //await cacheData('chapter:{' + args._id + '}', chapter);
            return chapter;
        },
        searchChapterByTitle: async (_, args) => {
            args.searchTerm = checkisValidString(args.searchTerm);
            /*  const chapterByTitle = await ifExist('search:chapter:{' + args.searchTitleTerm + '}');
              if (chapterByTitle) {
                  return chapterByTitle;
              }*/
            console.log('fetch');
            const chapters = await chapterCollection();
            const chaptersList = await chapters.find({ title: { $regex: args.searchTitleTerm, $options: 'i' } }).toArray();
            if (!chaptersList) {
                throwError(`No chapter found for the given title.`, NOT_FOUND);
            }
            // await cacheData('search:chapter:{' + args.searchTitleTerm + '}', chaptersList, 3600);//??
            return chaptersList;
        }
    },

    Book: {
        author: async (parentValue) => {
            //console.log(`parentValue in Book`, parentValue);
            const authors = await authorCollection();
            const author = await authors.findOne({ _id: new ObjectId(parentValue.authorId) });
            console.log('Book.author: ' + JSON.stringify(author));
            return author;
        },
        publisher: async (parentValue) => {
            //console.log(`parentValue in Book`, parentValue);
            const publishers = await publisherCollection();
            const publisher = await publishers.findOne({ _id: new ObjectId(parentValue.publisherId) });
            console.log('Book.publisher: ' + JSON.stringify(publisher));
            return publisher;
        },
        chapters: async (parentValue) => {
            //console.log(`parentValue in Book:Chapter`, parentValue);
            const chapters = await chapterCollection();
            const chapter = await chapters.find({ bookId: new ObjectId(parentValue._id) }).toArray();
            console.log('Book.chapters: ' + JSON.stringify(chapter));
            return chapter;
        }
    },
    Author: {
        books: async (parentValue) => {
            //console.log(`parentValue in Author`, parentValue);
            const book = await bookCollection();
            const books = await book
                .find({ authorId: parentValue._id })
                .toArray();
            return books;
        },
        numOfBooks: async (parentValue) => {
            //console.log(`parentValue in Author`, parentValue);
            const books = await bookCollection();
            const numOfBooks = await books.count({
                authorId: parentValue._id
            });
            return numOfBooks;
        }
    },
    Publisher: {
        books: async (parentValue) => {
            //console.log(`parentValue in Publisher`, parentValue);
            const book = await bookCollection();
            const books = await book
                .find({ publisherId: parentValue._id })
                .toArray();
            return books;
        },
        numOfBooks: async (parentValue) => {
            //console.log(`parentValue in Publisher`, parentValue);
            const books = await bookCollection();
            const numOfBooks = await books.count({
                publisherId: parentValue._id
            });
            return numOfBooks;
        }
    },
    Chapter: {
        book: async (parentValue) => {
            //console.log(`parentValue in Chapter`, parentValue);
            const book = await bookCollection();
            const books = await book.findOne({ _id: parentValue.bookId });
            return books;
        }
    },

    Mutation: {
        addAuthor: async (_, args) => {
            //Input validation            
            if (args.name) {
                args.name = checkisValidName(args.name);
            } if (args.bio) {
                args.bio = checkisValidString(args.bio, 'bio');
            }
            if (args.dateOfBirth) {
                args.dateOfBirth = checkisValidDate(args.dateOfBirth, 'dateOfBirth');
            }
            const author = await authorCollection();
            const newAuthor = {
                name: args.name,
                bio: args.bio ? args.bio : '',
                dateOfBirth: args.dateOfBirth,
                books: []
            };
            let insertedAuthor = await author.insertOne(newAuthor);
            if (!insertedAuthor.acknowledged || !insertedAuthor.insertedId) {
                throwError(`Could not Add Author`, INTERNAL_SERVER_ERROR);
            }
            const _id = insertedAuthor.insertedId.toString();
            const addedAuthor = await resolvers.Query.getAuthorById(_, { _id });
            await deleteFromCache('authors');

            await deleteKeyMatches();
            return addedAuthor;
        },
        editAuthor: async (_, args) => {
            //Input validation
            args._id = validateId(args._id);
            if (args.name) {
                args.name = checkisValidName(args.name);
            } if (args.bio) {
                args.bio = checkisValidString(args.bio, 'bio');
            }
            if (args.dateOfBirth) {
                args.dateOfBirth = checkisValidDate(args.dateOfBirth, 'dateOfBirth');
            }
            const author = await authorCollection();
            let _id = args._id;
            const existingAuthor = await resolvers.Query.getAuthorById(_, { _id });
            const editAuthor = {
                name: args.name ? args.name : existingAuthor.name,
                bio: args.bio ? args.bio : existingAuthor.bio,
                dateOfBirth: args.dateOfBirth ? args.dateOfBirth : existingAuthor.dateOfBirth,
                books: removeIdFromArray(existingAuthor.books, "")
            };
            let editedAuthor = await updateAuthor(args._id, editAuthor);
            if (!editedAuthor) {
                throwError(`Could not edit Author`, INTERNAL_SERVER_ERROR);
            }
            await deleteFromCache('author:{' + _id + '}');
            const editdAuthor = await resolvers.Query.getAuthorById(_, { _id });
            await deleteFromCache('authors');
            await deleteKeyMatches();
            return editdAuthor;
        },
        removeAuthor: async (_, args) => {
            //Input validation
            args._id = validateId(args._id);
            const authors = await authorCollection();
            let _id = args._id;
            await resolvers.Query.getAuthorById(_, { _id });
            const deletedAuthor = await authors.findOneAndDelete({ _id: new ObjectId(args._id) });

            if (!deletedAuthor) {
                throwError(`Could not delete author with _id of ${args._id}`, NOT_FOUND);
            }
            await deleteFromCache('author:{' + args._id + '}');
            await deleteFromCache('authors');
            const books = await bookCollection();
            const publisher = await publisherCollection();
            const chapter = await chapterCollection();

            const booksOfAuthor = await books.find({ authorId: new ObjectId(args._id) }).project({ _id: 1, publisherId: 1 }).toArray();
            if (booksOfAuthor) {

                for (let i = 0; i < booksOfAuthor.length; i++) {
                    await deleteFromCache('book:{' + booksOfAuthor[i]._id.toString() + '}');
                    //update the books array in publisher                    
                    const publisherByBooks = await publisher.findOne({ _id: booksOfAuthor[i].publisherId });

                    if (publisherByBooks) {
                        _id = publisherByBooks._id.toString();//publisherByBookId

                        let publisherByBook = await resolvers.Query.getPublisherById(_, { _id });
                        publisherByBooks.books = removeIdFromArray(publisherByBooks.books, booksOfAuthor[i]._id.toString());
                        await updatePublisher(_id, publisherByBooks);
                        await deleteFromCache('publisher:{' + _id + '}');
                        await resolvers.Query.getPublisherById(_, { _id });
                    }

                    await deleteFromCache('publishers');
                    //delete existing chapters of that book
                    const deleteChaptersByBookId = await chapter.deleteMany({ bookId: booksOfAuthor[i]._id });
                    if (!deleteChaptersByBookId) {
                        throwError(`Could not delete chapters for book with _id of ${booksOfAuthor[i]._id.toString()}`, INTERNAL_SERVER_ERROR);
                    }
                }
                const deleteBooksOfAuthor = await books.deleteMany({ authorId: new ObjectId(args._id) });
                if (!deleteBooksOfAuthor) {
                    throwError(`Could not delete books for author with _id of ${args._id}`, NOT_FOUND);
                }
                await deleteFromCache('publishers');
                await deleteFromCache('books');
            }
            await clearCache();
            return deletedAuthor;//need to check :what to return
        },
        addPublisher: async (_, args) => {
            //Input validation            
            if (args.name) {
                args.name = checkisValidName(args.name);
            } if (args.establishedYear) {
                args.establishedYear = validateYear(args.establishedYear);
            }
            if (args.location) {
                args.location = checkisValidLocation(args.location, 'location');
            }
            const publisher = await publisherCollection();
            const newPublisher = {
                name: args.name,
                establishedYear: args.establishedYear,
                location: args.location ? args.location : '',
                books: []
            };
            let insertedPublisher = await publisher.insertOne(newPublisher);
            if (!insertedPublisher.acknowledged || !insertedPublisher.insertedId) {
                throwError(`Could not Add Publisher`, INTERNAL_SERVER_ERROR);
            }
            const _id = insertedPublisher.insertedId.toString();
            const addedPublisher = await resolvers.Query.getPublisherById(_, { _id });
            await deleteFromCache('publishers');
            await deleteKeyMatches();
            return addedPublisher;
        },
        editPublisher: async (_, args) => {
            const publisher = await publisherCollection();
            //Input validation            
            if (args.name) {
                args.name = checkisValidName(args.name);
            } if (args.establishedYear) {
                args.establishedYear = validateYear(args.establishedYear);
            }
            if (args.location) {
                args.location = checkisValidLocation(args.location, 'location');
            }
            let _id = args._id;
            const existingPublisher = await resolvers.Query.getPublisherById(_, { _id });
            const editPublisher = {
                name: args.name ? args.name : existingPublisher.name,
                establishedYear: args.establishedYear ? args.establishedYear : existingPublisher.establishedYear,
                location: args.location ? args.location : existingPublisher.location,
                books: removeIdFromArray(existingPublisher.books, "")
            };
            let editedPublisher = await updatePublisher(args._id, editPublisher);
            if (!editedPublisher) {
                throwError(`Could not edit Publisher`, INTERNAL_SERVER_ERROR);
            }
            await deleteFromCache('publisher:{' + _id + '}');
            const editdPublisher = await resolvers.Query.getPublisherById(_, { _id });
            await deleteFromCache('publishers');
            await deleteKeyMatches();
            return editdPublisher;
        },
        removePublisher: async (_, args) => {
            const publisher = await publisherCollection();
            const deletedPublisher = await publisher.findOneAndDelete({ _id: new ObjectId(args._id) });

            if (!deletedPublisher) {
                throwError(`Could not delete Publisher with _id of ${args._id}`, NOT_FOUND);
            }
            await deleteFromCache('publisher:{' + args._id + '}');
            await deleteFromCache('publishers');
            const books = await bookCollection();
            const author = await authorCollection();
            const chapter = await chapterCollection();
            const booksByPublisher = await books.find({ publisherId: new ObjectId(args._id) }).project({ _id: 1, authorId: 1 }).toArray();
            if (booksByPublisher) {
                for (let i = 0; i < booksByPublisher.length; i++) {
                    await deleteFromCache('book:{' + booksByPublisher[i]._id.toString() + '}');
                    //update the books array in author                    
                    const authorByBooks = await author.findOne({ _id: booksByPublisher[i].authorId });
                    if (authorByBooks) {
                        let _id = authorByBooks._id.toString();//authorByBookId

                        let authorByBook = await resolvers.Query.getAuthorById(_, { _id });
                        authorByBooks.books = removeIdFromArray(authorByBooks.books, booksByPublisher[i]._id.toString());
                        await updateAuthor(_id, authorByBooks);
                        await deleteFromCache('author:{' + _id + '}');
                        await resolvers.Query.getAuthorById(_, { _id });
                    }


                    //delete existing chapters of that book
                    const deleteChaptersByBookId = await chapter.deleteMany({ bookId: booksByPublisher[i]._id });
                    if (!deleteChaptersByBookId) {
                        throwError(`Could not delete chapters for book with _id of ${booksByPublisher[i]._id.toString()}`, INTERNAL_SERVER_ERROR);
                    }
                }
                const deleteBooksByPublisher = await books.deleteMany({ publisherId: new ObjectId(args._id) });
                if (!deleteBooksByPublisher) {
                    throwError(`Could not delete books for publisher with _id of ${args._id}`, NOT_FOUND);
                }
                await deleteFromCache('authors');
                await deleteFromCache('books');
            }
            await clearCache();
            return deletedPublisher;//need to check :what to return
        },
        addBook: async (_, args) => {
            //Input validation
            args.authorId = validateId(args.authorId, 'author Id');
            args.publisherId = validateId(args.publisherId, 'author Id');
            //AuthorId is present and valid
            let _id = args.authorId;
            let author = await resolvers.Query.getAuthorById(_, { _id });
            //PublisherId is present and valid
            _id = args.publisherId;
            let publisher = await resolvers.Query.getPublisherById(_, { _id });
            args.publicationDate = checkisValidDate(args.publicationDate, 'publicationDate');
            checkisValidPublicationDate(args.publicationDate, author.dateOfBirth);
            checkisValidPublication(args.publicationDate, publisher.establishedYear)
            args.title = checkisValidTitle(args.title);

            const books = await bookCollection();
            const newBook = {
                title: args.title,
                publicationDate: args.publicationDate,
                genre: args.genre,
                authorId: new ObjectId(args.authorId),
                publisherId: new ObjectId(args.publisherId),
                chapters: []
            };
            let insertedBook = await books.insertOne(newBook);
            if (!insertedBook.acknowledged || !insertedBook.insertedId) {
                throwError(`Could not Add Book`, INTERNAL_SERVER_ERROR);
            }
            _id = insertedBook.insertedId.toString();
            const addedBook = await resolvers.Query.getBookById(_, { _id });
            //to convert Id string to ObjectId in DB
            author.books = removeIdFromArray(author.books, "");
            author.books.push(insertedBook.insertedId);
            await updateAuthor(args.authorId, author);
            await deleteFromCache('author:{' + args.authorId + '}');
            _id = args.authorId;
            await resolvers.Query.getAuthorById(_, { _id });

            //to convert Id string to ObjectId in DB
            publisher.books = removeIdFromArray(publisher.books, "");
            publisher.books.push(insertedBook.insertedId);
            await updatePublisher(args.publisherId, publisher);
            await deleteFromCache('publisher:{' + args.publisherId + '}');
            _id = args.publisherId;
            await resolvers.Query.getPublisherById(_, { _id });

            await deleteFromCache('books');
            await deleteFromCache('authors');
            await deleteFromCache('publishers');
            //await deleteFromCache('chapters:book:{' + bookId + '}');
            await deleteKeyMatches();
            return addedBook;
        },
        editBook: async (_, args) => {
            //Input validation
            args._id = validateId(args._id);
            let _id = args._id;
            const existingBook = await resolvers.Query.getBookById(_, { _id });
            if (args.title) {
                args.title = checkisValidTitle(args.title);
            }
            if (args.publicationDate) {

                args.publicationDate = checkisValidDate(args.publicationDate, 'publicationDate');
                if (args.authorId && existingBook.authorId.toString() !== args.authorId) {
                    _id = args.authorId;
                    let author = await resolvers.Query.getAuthorById(_, { _id });
                    checkisValidPublicationDate(args.publicationDate, author.dateOfBirth);
                } else {
                    _id = existingBook.authorId.toString();
                    let author = await resolvers.Query.getAuthorById(_, { _id });
                    checkisValidPublicationDate(args.publicationDate, author.dateOfBirth);
                }
                if (args.publisherId && existingBook.publisherId.toString() !== args.publisherId) {
                    _id = args.publisherId;
                    let publisher = await resolvers.Query.getPublisherById(_, { _id });
                    checkisValidPublication(args.publicationDate, publisher.establishedYear);
                } else {
                    _id = existingBook.publisherId.toString();
                    let publisher = await resolvers.Query.getPublisherById(_, { _id });
                    checkisValidPublication(args.publicationDate, publisher.establishedYear);
                }
            }
            //validate genre??
            if (args.authorId) {
                if (existingBook.authorId.toString() !== args.authorId) {
                    args.authorId = validateId(args.authorId, 'author Id');
                    const author = await authorCollection();
                    const authorCount = await author.count({ _id: new ObjectId(args.authorId) });
                    if (authorCount === 1) {
                        _id = existingBook.authorId.toString();
                        let oldAuthorLink = await resolvers.Query.getAuthorById(_, { _id });
                        oldAuthorLink.books = removeIdFromArray(oldAuthorLink.books, args._id);
                        await updateAuthor(existingBook.authorId, oldAuthorLink);
                        await deleteFromCache('author:{' + _id + '}');
                        await resolvers.Query.getAuthorById(_, { _id });
                        _id = args.authorId;
                        let newAuthorLink = await resolvers.Query.getAuthorById(_, { _id });
                        //to convert Id string to ObjectId in DB
                        newAuthorLink.books = removeIdFromArray(newAuthorLink.books, "");
                        newAuthorLink.books.push(new ObjectId(args._id));
                        await updateAuthor(args.authorId, newAuthorLink);
                        await deleteFromCache('author:{' + _id + '}');
                        await resolvers.Query.getAuthorById(_, { _id });
                    } else {
                        throwError(`Could not Find Author with an ID of ${args.authorId}`, BAD_USER_INPUT);
                    }
                }
            }

            if (args.publisherId) {
                if (existingBook.publisherId.toString() !== args.publisherId) {
                    args.publisherId = validateId(args.publisherId, 'author Id');
                    const publisher = await publisherCollection();
                    const publisherCount = await publisher.count({ _id: new ObjectId(args.publisherId) });
                    if (publisherCount === 1) {
                        _id = existingBook.publisherId.toString();
                        let oldPublisherLink = await resolvers.Query.getPublisherById(_, { _id });
                        oldPublisherLink.books = removeIdFromArray(oldPublisherLink.books, args._id);
                        await updatePublisher(existingBook.publisherId, oldPublisherLink);
                        await deleteFromCache('publisher:{' + _id + '}');
                        await resolvers.Query.getPublisherById(_, { _id });
                        _id = args.publisherId;
                        let newPublisherLink = await resolvers.Query.getPublisherById(_, { _id });
                        //to convert Id string to ObjectId in DB
                        newPublisherLink.books = removeIdFromArray(newPublisherLink.books, "");
                        newPublisherLink.books.push(new ObjectId(args._id));
                        await updatePublisher(args.publisherId, newPublisherLink);
                        await deleteFromCache('publisher:{' + _id + '}');
                        await resolvers.Query.getPublisherById(_, { _id });
                    } else {
                        throwError(`Could not Find publisher with an ID of ${args.publisherId}`, BAD_USER_INPUT);
                    }
                }
            }

            const editBook = {
                title: args.title ? args.title : existingBook.title,
                publicationDate: args.publicationDate ? args.publicationDate : existingBook.publicationDate,
                genre: args.genre ? args.genre : existingBook.genre,
                authorId: args.authorId ? new ObjectId(args.authorId) : new ObjectId(existingBook.authorId),
                publisherId: args.publisherId ? new ObjectId(args.publisherId) : new ObjectId(existingBook.publisherId),
                chapters: removeIdFromArray(existingBook.chapters, "")
            };

            let editedBook = await updateBook(args._id, editBook);
            if (!editedBook) {
                throwError(`Could not edit Book`, NOT_FOUND);
            }
            _id = args._id;
            await deleteFromCache('book:{' + _id + '}');
            const editdBook = await resolvers.Query.getBookById(_, { _id });
            await deleteFromCache('books');
            await deleteFromCache('authors');
            await deleteFromCache('publishers');
            await clearCache();
            return editdBook;
        },
        removeBook: async (_, args) => {
            //Input validation
            args._id = validateId(args._id);
            const books = await bookCollection();
            const chapter = await chapterCollection();
            let _id = args._id;
            const bookToDelete = await resolvers.Query.getBookById(_, { _id });
            const authorId = bookToDelete.authorId;
            const publisherId = bookToDelete.publisherId;
            const deletedBook = await books.findOneAndDelete({ _id: new ObjectId(args._id) });
            if (!deletedBook) {
                throwError(`Could not delete Book with _id of ${args._id}`, NOT_FOUND);
            }
            if (bookToDelete.chapters && bookToDelete.chapters.length > 0) {
                //delete existing chapters of that book
                const deleteChaptersByBookId = await chapter.deleteMany({ bookId: new ObjectId(args._id) });
                if (!deleteChaptersByBookId) {
                    throwError(`Could not delete chapters for book with _id of ${args._id}`, INTERNAL_SERVER_ERROR);
                }
            }
            _id = authorId.toString();
            let oldAuthorLink = await resolvers.Query.getAuthorById(_, { _id });
            oldAuthorLink.books = removeIdFromArray(oldAuthorLink.books, args._id);
            await updateAuthor(authorId, oldAuthorLink);
            await deleteFromCache('author:{' + _id + '}');
            await resolvers.Query.getAuthorById(_, { _id });

            _id = publisherId.toString();
            let oldPublisherLink = await resolvers.Query.getPublisherById(_, { _id });
            oldPublisherLink.books = removeIdFromArray(oldPublisherLink.books, args._id);
            await updatePublisher(publisherId, oldPublisherLink);
            await deleteFromCache('publisher:{' + _id + '}');
            await resolvers.Query.getPublisherById(_, { _id });

            await clearCache();
            // await deleteFromCache('book:{' + args._id + '}');
            // await deleteFromCache('books');
            // await deleteFromCache('authors');
            // await deleteFromCache('publishers');
            return deletedBook;
        },
        addChapter: async (_, args) => {
            //ToDo :Unique chapters
            args.title = checkisValidTitle(args.title);
            args.bookId = validateId(args.bookId);
            const chapter = await chapterCollection();
            let _id = args.bookId;
            let book = await resolvers.Query.getBookById(_, { _id });
            if (book.chapters && book.chapters.length > 0) {
                await validateUniqueChapters(book, args.title);
            }


            let chapterObj = {
                _id: new ObjectId(),
                title: args.title,
                bookId: new ObjectId(args.bookId)
            };
            let insertedChapter = await chapter.insertOne(chapterObj);
            if (!insertedChapter.acknowledged || !insertedChapter.insertedId) {
                throwError(`Could not Add Chapter`, INTERNAL_SERVER_ERROR);
            }
            book.chapters = removeIdFromArray(book.chapters, "");
            book.authorId = new ObjectId(book.authorId);
            book.publisherId = new ObjectId(book.publisherId);
            book.chapters.push(insertedChapter.insertedId);
            await updateBook(args.bookId, book);
            await deleteFromCache('book:{' + args.bookId + '}');
            await deleteFromCache('books');
            await resolvers.Query.getBookById(_, { _id });

            _id = insertedChapter.insertedId.toString();
            return await resolvers.Query.getChapterById(_, { _id });
        },
        editChapter: async (_, args) => {
            //TODo :Unique chapters
            const chapter = await chapterCollection();
            args._id = validateId(args._id);
            if (args.title) {
                args.title = checkisValidTitle(args.title);
            }
            if (args.bookId) {
                args.bookId = validateId(args.bookId);
            }
            let _id = args._id;
            const existingChapter = await resolvers.Query.getChapterById(_, { _id });
            if (args.title && args.title !== existingChapter.title) {
                if (args.bookId && existingChapter.bookId.toString() !== args.bookId) {
                    _id = args.bookId;
                    let book = await resolvers.Query.getBookById(_, { _id });
                    await validateUniqueChapters(book, args.title);
                } else {
                    _id = existingChapter.bookId.toString();
                    let book = await resolvers.Query.getBookById(_, { _id });
                    await validateUniqueChapters(book, args.title);
                }
            }
            if (args.bookId) {
                if (existingChapter.bookId.toString() !== args.bookId) {
                    let _id = existingChapter.bookId.toString();
                    let oldBookLink = await resolvers.Query.getBookById(_, { _id });
                    oldBookLink.authorId = new ObjectId(oldBookLink.authorId);
                    oldBookLink.publisherId = new ObjectId(oldBookLink.publisherId);
                    oldBookLink.chapters = removeIdFromArray(oldBookLink.chapters, args._id);
                    await updateBook(_id, oldBookLink);
                    await deleteFromCache('book:{' + _id + '}');

                    await resolvers.Query.getBookById(_, { _id });

                    _id = args.bookId;
                    let newBookLink = await resolvers.Query.getBookById(_, { _id });
                    newBookLink.chapters = removeIdFromArray(newBookLink.chapters, "");
                    newBookLink.authorId = new ObjectId(newBookLink.authorId);
                    newBookLink.publisherId = new ObjectId(newBookLink.publisherId);
                    newBookLink.chapters.push(new ObjectId(args._id));
                    await updateBook(_id, newBookLink);
                    await deleteFromCache('book:{' + _id + '}');
                    await resolvers.Query.getBookById(_, { _id });


                    await deleteFromCache('books');
                }

            }
            _id = args._id;
            let editChapter = {
                title: args.title ? args.title : existingChapter.title,
                bookId: args.bookId ? new ObjectId(args.bookId) : existingChapter.bookId
            };

            let editedChapter = await chapter.findOneAndReplace(
                { _id: ObjectId.createFromHexString(args._id) },
                editChapter,
                { returnDocument: 'after' });
            if (!editedChapter) {
                throwError(`Could not edit Chapter`, NOT_FOUND);
            }

            // await deleteFromCache('chapters:book:{' + args.bookId + '}');
            return await resolvers.Query.getChapterById(_, { _id });
        },
        removeChapter: async (_, args) => {
            const chapter = await chapterCollection();
            args._id = validateId(args._id);
            let _id = args._id;
            let existingChapter = await resolvers.Query.getChapterById(_, { _id });
            let bookId = existingChapter.bookId.toString();
            _id = bookId;
            let oldBookLink = await resolvers.Query.getBookById(_, { _id });
            oldBookLink.authorId = new ObjectId(oldBookLink.authorId);
            oldBookLink.publisherId = new ObjectId(oldBookLink.publisherId);
            oldBookLink.chapters = removeIdFromArray(oldBookLink.chapters, args._id);
            await updateBook(_id, oldBookLink);
            await deleteFromCache('book:{' + bookId + '}');
            _id = bookId;
            await resolvers.Query.getBookById(_, { _id });
            await deleteFromCache('books');
            return await chapter.findOneAndDelete({ _id: new ObjectId(args._id) });
            // await deleteFromCache('chapter:{' + args._id + '}');
            // await deleteFromCache('chapters:book:{' + args.bookId + '}');
        }
    }
};