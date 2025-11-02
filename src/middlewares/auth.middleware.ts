import { APIError } from "@/utils/APIError";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new APIError(
			401,
			"Authentication required. Please provide a valid token.",
		);
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as jwt.JwtPayload;
		if (!decoded || !decoded.adminId) {
			throw new APIError(401, "Invalid token. Authentication failed.");
		}
	} catch (error) {
		throw new APIError(401, "Invalid token. Authentication failed.");
	}

	next();
};
