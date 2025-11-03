import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { sendConfirmationEmail } from "@/services/resend.service";
import { APIError } from "@/utils/APIError";
import { Request, Response } from "express";

const captureContactForm = catchAsync(async (req: Request, res: Response) => {
	const { name, email, subject, message } = req.body;
	if (!name || !email || !subject || !message) {
		throw new APIError(400, "Name, email, subject, and message are required");
	}
	try {
		await db.contactUs.create({
			data: {
				name: name,
				subject: subject,
				email: email,
				message: message,
			},
		});
		await sendConfirmationEmail(email)
		res.status(200).json({
			status: "success",
			message: "Contact form submitted successfully",
		});
		return;
	} catch (error) {
		throw new APIError(500, "Failed to process contact form");
	}
});

export default {
	captureContactForm,
};
