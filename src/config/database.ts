import { PrismaClient } from "../../generated/prisma";
import { logger } from "./logger";


interface CustomNodeJsGlobal extends Global {
	prisma: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

// Create PrismaClient with logging enabled to help diagnose connection issues
if (!global.prisma) {
	global.prisma = new PrismaClient({
		log: ["info", "warn", "error"],
	});
}
export const db = global.prisma;

// Track whether Prisma has successfully connected so other parts of the app
// can report DB health without attempting queries that would fail.
let _isDbConnected = false;
export function isDbConnected() {
	return _isDbConnected;
}

// Attempt to connect with a small retry/backoff loop to handle transient network issues.
async function connectWithRetry(maxRetries = 5, initialDelayMs = 1000) {
	let attempt = 0;
	let delay = initialDelayMs;
	while (attempt < maxRetries) {
		try {
			await db.$connect();
			_isDbConnected = true;
			logger.info("[PRISMA] : connected to database");
			return;
		} catch (error: any) {
			attempt += 1;
			logger.warn(
				`[PRISMA] : failed to connect (attempt ${attempt}/${maxRetries}):`,
				error?.message ?? error,
			);
			if (attempt >= maxRetries) {
				logger.error("[PRISMA] : exhausted all connection retries.", error);
				// leave _isDbConnected as false so health checks report DB down
				return;
			}
			// exponential backoff
			await new Promise((res) => setTimeout(res, delay));
			delay *= 2;
		}
	}
}

// Start background connection attempts (do not block module initialization).
connectWithRetry().catch((err) => logger.error("[PRISMA] : connectWithRetry unexpected error:", err));
