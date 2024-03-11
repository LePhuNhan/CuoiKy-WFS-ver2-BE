import { log } from "console";
import movieModel from "../model/Movie.model.js";
import fs from 'fs';
import path from 'path';
import cloudinary from 'cloudinary';
import { uploadSingle } from "../middlewares/uploadSingle.js"
cloudinary.config({
  cloud_name: 'dms0thodp',
  api_key: '548773821674149',
  api_secret: 'gQvqDpXG18zbt10XGUShC2PIIao'
});
export const getAllMovie = async (req, res, next) => {
  try {
    const movies = await movieModel.find();
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
    try {
      const movieId = req.params.movieId;
      const movie = await movieModel.findById(movieId);
      console.log(movie);
      if (!movie) {
        return res.status(404).send("Movie not found");
      }
      res.status(200).send(movie);
    } catch (error) {
      next(error);
    }
  };
  export const createMovie = async (req, res, next) => {
    try {
      const { ID, name, time, year, image, introduce } = req.body;
      const newMovie = await movieModel.create({
        ID,
        name,
        time,
        year,
        image,
        introduce,
      });
      console.log(newMovie);
      res.status(201).json(newMovie);
    } catch (error) {
      next(error);
    }
  };
  export const updateMovie = async (req, res, next) => {
    try {
        const movieId = req.params.movieId;
        const { ID, name, time, year, introduce } = req.body;

        let imagePath;
        console.log(req.file);
        // Kiểm tra nếu có tệp hình ảnh được tải lên
        uploadSingle(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'Không thể tải lên tệp hình ảnh.' });
            }
            if (req.file) {
                const file = req.file;

                const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
                const fileName = file.originalname.split('.')[0];

                // Upload hình ảnh lên Cloudinary và nhận đường dẫn hình ảnh
                const result = await cloudinary.uploader.upload(dataUrl, {
                    public_id: fileName,
                    resource_type: 'auto',
                });

                imagePath = result.secure_url;
            }

            // Chuẩn bị dữ liệu phim để cập nhật
            const movieData = { ID, name, time, year, introduce };
            if (imagePath) {
                movieData.image = imagePath;
            }

            // Tìm phim theo ID và cập nhật
            const updatedMovie = await movieModel.findByIdAndUpdate(movieId, movieData, { new: true });

            if (!updatedMovie) {
                return res.status(404).send("Không tìm thấy phim");
            }

            res.status(200).json(updatedMovie);
        });
    } catch (error) {
        next(error);
    }
};
export const deleteMovie = async (req, res, next) => {
  try {
    const movieId = req.params.movieId;

    // Find the movie by ID and delete it
    const deletedMovie = await movieModel.findByIdAndDelete(movieId);

    // Check if the movie exists
    if (!deletedMovie) {
      return res.status(404).send("Movie not found");
    }

    res.status(200).send("Movie deleted");
  } catch (error) {
    next(error);
  }
};
export const searchMovieByName = async (req, res, next) => {
  try {
    const { name } = req.query;
    console.log(name);
    const movies = await movieModel.find({ name: { $regex: new RegExp(name, "i") } });

    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};
export const getMoviesSortedByYear = async (req, res) => {
  try {
    const { sort } = req.query;
    const sortOrder = sort === 'desc' ? -1 : 1; // Set sortOrder based on the query parameter

    const movies = await movieModel.find().sort({ year: sortOrder });
    console.log(movies);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
