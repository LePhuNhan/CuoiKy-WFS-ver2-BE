import express from "express";

import {
  userLogin,
  userSignup,
  userLogout,
} from "../controller/user.controller.js";

import { requireUser } from "../middlewares/requireUser.middleware.js";
import { tryCatch } from "../Utils/tryCatch.middleware.js";
import { validToken } from "../middlewares/validToken.middleware.js";

const router = express.Router();

router.route("/login").post(tryCatch(userLogin));

router.route("/register").post(tryCatch(userSignup));
debugger
router.route("/logout").delete(tryCatch(requireUser), tryCatch(userLogout));


export { router as userRouter };
