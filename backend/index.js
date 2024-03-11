import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { routeFactory } from "./routes/index.js";
import { validToken } from "./middlewares/validToken.middleware.js";


const app = express();


dotenv.config();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use(validToken);

app.use(
  cors()
);


routeFactory(app);

mongoose.connect(process.env.MONGO_URI).then(
  app.listen(process.env.PORT, () => {
    console.log("Server is connecting");
  })
);
