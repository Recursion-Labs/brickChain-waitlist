import { Resend } from "resend";
import fs from "fs";
import path from "node:path";
import { logger } from "@/config/logger";

const resendClient = new Resend(process.env.RESEND_API_KEY!);

export async function sendOTP(email: string) {
	const templatePath = path.join(__dirname, "../templates/applicationReceived.html");
	let html = "";
	try {
		const template = fs.readFileSync(templatePath, "utf8");
		html = template;
	} catch (err) {
		logger.warn("Failed to load template, falling back to simple OTP HTML:", err);
	}

	await resendClient.emails.send({
		from: "otps@techsolace.tech",
		to: email,
		subject: "Your OTP Code",
		html,
	});
}
