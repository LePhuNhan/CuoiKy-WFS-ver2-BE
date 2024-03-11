import jwt from "jsonwebtoken";
import { getSession } from "../Utils/sessionHandler.js";
import { verifyJWT } from "../Utils/jwt.utils.js";

const validToken = async (req, res, next) => {
  req.user = {};
  const { access_token: accessToken, refresh_token: refreshToken } =
    req.cookies;
  if (!accessToken) {
    return next();
  }
  const { payload: user, expired } = verifyJWT(
    accessToken,
    process.env.ACCESS_KEY
  );
  if (user) {
    req.user = user; // need to access the protected route
    return next();
  }

  const { payload: refresh } =
    expired && refreshToken
      ? verifyJWT(refreshToken, process.env.REFRESH_KEY)
      : null;

  const session = await getSession(refresh.sessionId);
  if (!session) next();

  const newAccessToken = jwt.sign(
    { sessionId: session._id, userId: session.userId },
    process.env.ACCESS_KEY,
    {
      expiresIn: "5s",
    }
  );
  res.cookie("access_token", newAccessToken, {
    maxAge: 300000,
    httpOnly: true,
  });
  req.user = verifyJWT(newAccessToken, process.env.ACCESS_KEY).payload; //need to access the protected route
  return next();
};
export { validToken };
