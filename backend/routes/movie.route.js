import express from "express";
import { tryCatch } from "../Utils/tryCatch.middleware.js";
import {getAllMovie,getMovieById, createMovie, updateMovie, deleteMovie,searchMovieByName, getMoviesSortedByYear} from "../controller/movie.controller.js"

const movieRouter = express.Router();
movieRouter
  .route("/")
  .get(tryCatch(getAllMovie))
  .post(tryCatch(createMovie))
  .put()
  .delete();
movieRouter
  .route("/search")
  .get(tryCatch(searchMovieByName))
  .post()
  .put()
  .delete();
movieRouter
  .route("/sort")
  .get(tryCatch(getMoviesSortedByYear))
  .post()
  .put()
  .delete();
movieRouter
  .route("/:movieId")
  .get(tryCatch(getMovieById))
  .post()
  .put(tryCatch(updateMovie))
  .delete(tryCatch(deleteMovie));
export { movieRouter };
