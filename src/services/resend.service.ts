import { Resend } from "resend";
import fs from "fs";
import path from "node:path";
import { logger } from "@/config/logger";

const resendClient = new Resend(process.env.RESEND_API_KEY!);

export async function sendWaitlistConfirmation(email: string) {
	const templatePath = path.join(__dirname, "../templates/applicationReceived.html");
	let html = "";
	try {
		html = fs.readFileSync(templatePath, "utf8");
	} catch (err) {
		logger.warn("Failed to load template, falling back to simple OTP HTML:", err);
	}

	await resendClient.emails.send({
		from: "ship@techsolace.tech",
		to: email,
		subject: "Brickchain Waitlist Confirmation",
		html,
	});
}
