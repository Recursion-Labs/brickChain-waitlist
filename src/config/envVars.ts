import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";
import { logger } from "./logger";

dotenv.config({ path: path.join(__dirname, "../../.env") });

const EnvConfigSchema = z.object({
	PORT: z.coerce
		.number({
			error: "PORT must be a valid number",
		})
		.int()
		.positive()
		.default(3000),

	NODE_ENV: z
		.enum(["development", "production", "test"] as const, {
			error: "NODE_ENV must be one of: development, production, test",
		})
		.default("development"),

	RESEND_API_KEY: z.string().min(1, { message: "RESEND_API_KEY is required" }),
	JWT_SECRET: z.string().min(1, { message: "JWT_SECRET is required" }),
});
export type EnvConfig = z.infer<typeof EnvConfigSchema>;

const rawConfig = {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	RESEND_API_KEY: process.env.RESEND_API_KEY,
	JWT_SECRET: process.env.JWT_SECRET,
};

let envVars: EnvConfig;

try {
	envVars = EnvConfigSchema.parse(rawConfig);
	logger.info("[SYSTEM] Environment configuration loaded.");
} catch (error) {
	if (error instanceof z.ZodError) {
		logger.error("[SYSTEM] Environment configuration validation failed:", error.issues);
		error.issues.forEach((err) => {
			logger.error(`- ${err.path.join(".")}: ${err.message}`);
		});
	} else {
		logger.error("Unknown error during environment config validation:", error);
	}
	throw new Error("Environment configuration validation failed. Check environment variables.");
}

export const { PORT, NODE_ENV, RESEND_API_KEY, JWT_SECRET } = envVars;

export default envVars;
