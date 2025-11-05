import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { sendWaitlistConfirmation } from "@/services/resend.service";
import { validateEmail } from "@/utils/emailValidation";
import { APIError } from "@/utils/APIError";
import type { Request, Response } from "express";

const submitWaitlist = catchAsync(async (req: Request, res: Response) => {
	const { email } = req.body;
	if (!email) {
		throw new APIError(400, "Email is required");
	}

	// Validate email format and check for fake emails
	const emailValidation = validateEmail(email);
	if (!emailValidation.isValid) {
		throw new APIError(400, emailValidation.error || "Invalid email address");
	}

	const check = await db.responses.findFirst({
		where: {
			email: email.toLowerCase().trim(),
		},
	});
	if (check) {
		throw new APIError(400, "Email already submitted to waitlist");
	}
	await db.responses.create({
		data: {
			email: email.toLowerCase().trim(),
		},
	});
	await sendWaitlistConfirmation(email);
	res.status(200).json({
		status: "success",
		message: "Successfully submitted to waitlist",
	});
	return;
});

export default { submitWaitlist };
