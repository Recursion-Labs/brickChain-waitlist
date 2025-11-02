import { Router } from "express";
import authRoutes from "./public/routes";

const v1Router = Router();

const v1_routes = [
	{
		path: "/public",
		route: authRoutes,
	},
];
v1_routes.forEach((route) => {
	v1Router.use(route.path, route.route);
});

export default v1Router;
