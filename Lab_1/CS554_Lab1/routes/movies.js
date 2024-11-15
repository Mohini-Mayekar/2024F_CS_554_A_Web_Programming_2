// Import the express router as shown in the lecture code
// Note: please do not forget to export the router!
import express from 'express';
import { moviesData } from '../data/index.js';
import { validateMovieInput, validateId, validateMovieInputPatch, checkQueryParam, checkQueryParamKey, checkUndefinedOrNull, checkisValidName, checkisValidString, errMsg } from '../helpers.js'

const router = express.Router();

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      checkQueryParamKey(req.query);
      let skip = checkQueryParam(req.query.skip, 'skip', true);
      let take = checkQueryParam(req.query.take, 'take', true);
      const moviesList = await moviesData.getAll(skip, take);
      return res.json(moviesList);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let movieData = req.body;
    //make sure there is something present in the req.body
    if (!movieData || Object.keys(movieData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    //check all inputs, that should respond with a 400
    try {
      movieData = validateMovieInput(null, movieData.title, movieData.cast, movieData.info, movieData.plot, movieData.rating, false);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }

    //create the movie
    try {

      const newMovie = await moviesData.createMovie(movieData.title, movieData.cast, movieData.info, movieData.plot, movieData.rating);
      return res.json(newMovie);
    } catch (e) {
      return res.status(500).json({ error: errMsg(e) });
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    //code here for GET
    try {
      req.params.id = validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    //try getting the movie by ID
    try {
      const movie = await moviesData.getById(req.params.id);
      return res.json(movie);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    try {
      req.params.id = validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    let updatedData = req.body;
    //make sure there is something in the req.body
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    //check all the inputs that will return 400 if they fail
    try {
      updatedData = validateMovieInput(req.params.id, updatedData.title, updatedData.cast, updatedData.info, updatedData.plot, updatedData.rating, true);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    //try to update the product
    try {
      const updatedMovie = await moviesData.updatePut(req.params.id, updatedData.title, updatedData.cast, updatedData.info, updatedData.plot, updatedData.rating);
      return res.json(updatedMovie);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
  })
  .patch(async (req, res) => {
    //code here for PATCH
    try {
      req.params.id = validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    let updatedData = req.body;
    if (!updatedData || Object.keys(updatedData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    try {
      updatedData = await validateMovieInputPatch(req.params.id, updatedData.title, updatedData.cast, updatedData.info, updatedData.plot, updatedData.rating);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }

    try {
      const updateMovie = await moviesData.updatePatch(req.params.id, updatedData.title, updatedData.cast, updatedData.info, updatedData.plot, updatedData.rating);
      return res.json(updateMovie);
    } catch (e) {
      return res.status(400).send({ error: errMsg(e) });
    }
  });

router
  .route('/:id/comments')
  .post(async (req, res) => {
    //code here for POST
    try {
      req.params.id = validateId(req.params.id, 'Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    let commentData = req.body;
    //make sure there is something present in the req.body
    if (!commentData || Object.keys(commentData).length === 0) {
      return res
        .status(400)
        .json({ error: 'There are no fields in the request body' });
    }
    //check all inputs, that should respond with a 400
    try {
      checkUndefinedOrNull(commentData.name, 'name');
      checkUndefinedOrNull(commentData.comment, 'comment');
      commentData.name = checkisValidString(commentData.name, 'name');
      checkisValidName(commentData.name, 'name');
      commentData.comment = checkisValidString(commentData.comment, 'comment');
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    //add a comment
    try {
      const newComment = await moviesData.addComment(req.params.id, commentData.name, commentData.comment);
      return res.json(newComment);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
  });


router
  .route('/:movieId/:commentId')
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      req.params.movieId = validateId(req.params.movieId, 'Id URL Param');
      req.params.commentId = validateId(req.params.commentId, 'comment Id URL Param');
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
    //try to delete review
    try {
      let deletedComment = await moviesData.deleteComment(req.params.movieId, req.params.commentId);
      return res.json(deletedComment);
    } catch (e) {
      return res.status(400).json({ error: errMsg(e) });
    }
  });

export default router;
