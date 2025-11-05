import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { sendConfirmationEmail } from "@/services/resend.service";
import { validateEmail } from "@/utils/emailValidation";
import { APIError } from "@/utils/APIError";
import { Request, Response } from "express";

const captureContactForm = catchAsync(async (req: Request, res: Response) => {
	const { name, email, subject, message } = req.body;
	if (!name || !email || !subject || !message) {
		throw new APIError(400, "Name, email, subject, and message are required");
	}

	// Validate email format and check for fake emails
	const emailValidation = validateEmail(email);
	if (!emailValidation.isValid) {
		throw new APIError(400, emailValidation.error || "Invalid email address");
	}

	try {
		await db.contactUs.create({
			data: {
				name: name.trim(),
				subject: subject.trim(),
				email: email.toLowerCase().trim(),
				message: message.trim(),
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
