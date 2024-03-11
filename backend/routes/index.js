import { userRouter } from "./user.route.js";
import { validToken } from "../middlewares/validToken.middleware.js";
import { requireUser } from "../middlewares/requireUser.middleware.js";
import { movieRouter } from "./movie.route.js";
// const router = express.Router();

const routes = [
  {
    path: "/user",
    router: userRouter,
  },
  {
    path: "/movie",
    router: movieRouter,
  },
];

function routeFactory(app) {
  routes.map((route) => {
    if ((route.path === "/user")) {
      app.use(route.path, route.router); //public route
    }
    if ((route.path === "/movie")) {
      app.use(route.path, requireUser, route.router); //private route
    }
  });
}

export { routeFactory };
