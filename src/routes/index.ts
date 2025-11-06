import { Router } from "express";
import v1Router from "./v1";
import { isDbConnected } from "@/config/database";

const router = Router();

router.get("/health", (req, res) => {
	res.status(200).json({
		status: "ok",
		message: "Server is running",
		timestamp: new Date().toISOString(),
		db: isDbConnected(),
	});
	return;
});

router.use("/v1", v1Router);

export default router;
