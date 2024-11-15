// This data file should export all functions using the ES6 standard as shown in the lecture code
import { movies } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import { validateMovieInput, validateMovieInputPatch, validateId, updateMovie, checkQueryParam, checkUndefinedOrNull, checkisValidName, checkisValidString } from '../helpers.js'


const createMovie = async (
  title,
  cast,
  info,
  plot,
  rating,
  comments
) => {
  let newMovie = validateMovieInput(null, title, cast, info, plot, rating, false);

  const moviesCollection = await movies();
  const insertInfo = await moviesCollection.insertOne(newMovie);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Could not add movie';

  const newId = insertInfo.insertedId.toString();

  const movie = await getById(newId);
  return movie;
};

const getAll = async (skip, take) => {
  skip = checkQueryParam(skip, 'skip', false);
  take = checkQueryParam(take, 'take', false);
  const moviesCollection = await movies();
  let moviesList = await moviesCollection.find({}).skip(skip).limit(take).toArray();
  if (!moviesList) throw 'Could not get any movies';
  return moviesList;
};

const getById = async (movieId) => {
  movieId = validateId(movieId, 'movieId');
  const moviesCollection = await movies();
  let movie = await moviesCollection.findOne({ _id: new ObjectId(movieId) });
  if (movie === null) throw `No movie with movieId '${movieId}'.`;
  return movie;
};

const updatePut = async (
  movieId,
  title,
  cast,
  info,
  plot,
  rating
) => {
  let updatedMovie = validateMovieInput(movieId, title, cast, info, plot, rating, true);

  const movie = await getById(movieId);
  updatedMovie.comments = movie.comments;

  const updatedInfo = await updateMovie(movieId, updatedMovie);
  return updatedInfo;
};

const updatePatch = async (
  movieId,
  title,
  cast,
  info,
  plot,
  rating
) => {
  let updatedMovie = await validateMovieInputPatch(movieId, title, cast, info, plot, rating);

  const updatedInfo = await updateMovie(movieId, updatedMovie);
  return updatedInfo;
};

const addComment = async (
  movieId,
  name,
  comment
) => {
  //validte input
  movieId = validateId(movieId, 'movieId');
  checkUndefinedOrNull(name, 'name');
  checkUndefinedOrNull(comment, 'comment');
  name = checkisValidString(name, 'name');
  checkisValidName(name, 'name');
  comment = checkisValidString(comment, 'comment');

  const movie = await getById(movieId);

  let newComment = {};
  newComment._id = new ObjectId();
  newComment.name = name;
  newComment.comment = comment;

  movie.comments.push(newComment);
  delete movie._id;
  const updatedInfo = await updateMovie(movieId, movie);
  return updatedInfo;

};

const deleteComment = async (
  movieId,
  commentId
) => {
  //validte input
  movieId = validateId(movieId, 'movieId');
  commentId = validateId(commentId, 'commentId');

  const movie = await getById(movieId);
  const moviesCollection = await movies();
  //get the comment obj
  //delete the comment record
  const deletionInfo = await moviesCollection.updateOne(
    { 'comments._id': ObjectId.createFromHexString(commentId) },
    { $pull: { comments: { _id: ObjectId.createFromHexString(commentId) } } }
  );

  if (!deletionInfo || !deletionInfo.acknowledged) {
    throw `Could not delete comment with id of ${commentId}`;
  }

  return `Selected comment for '${movie.title}' has been deleted!`;
};


export default {
  createMovie, getAll, getById, updatePut, updatePatch, addComment, deleteComment
}