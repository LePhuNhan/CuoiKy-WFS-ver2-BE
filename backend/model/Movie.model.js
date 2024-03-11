import mongoose from "mongoose";

const MovieSchema = mongoose.Schema({
  ID: {
    type: String,
  },
  name: {
    type: String,
  },
  time: {
    type: String,
  },
  year: {
    type: String,
  },
  image: {
    type: String,
  },
  introduce: {
    type: String,
  }
});

const movieModel = mongoose.model("Movie", MovieSchema);

export default movieModel;
