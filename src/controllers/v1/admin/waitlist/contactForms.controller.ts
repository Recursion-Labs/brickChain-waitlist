import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { Request, Response } from "express";

const getAllContactForms = catchAsync(async (req: Request, res: Response) => {
	const forms = await db.contactUs.findMany();
	res.status(200).json({
		status: "success",
		data: forms,
	});
});

export default {
	getAllContactForms,
};
