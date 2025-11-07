import envVars from "@/config/envVars";
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
			envVars.JWT_SECRET as string,
		) as jwt.JwtPayload;
		if (!decoded || !decoded.role || decoded.role !== "admin".toUpperCase()) {
			throw new APIError(401, "Invalid token. Authentication failed.");
		}
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
            throw new APIError(401, "Token has expired. Please log in again.");
        }
        if (decoded.iat && Date.now() < decoded.iat * 1000) {
            throw new APIError(401, "Token not valid yet. Please log in again.");
        }
        if (decoded.role == "user".toUpperCase()) {
            throw new APIError(401, "Insufficient permissions. Admins only.");
        }
	} catch (error) {
		throw new APIError(401, "Invalid token. Authentication failed.");
	}

	next();
};
