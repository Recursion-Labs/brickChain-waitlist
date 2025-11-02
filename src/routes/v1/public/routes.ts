import { v1Controllers } from "@/controllers";
import { Router } from "express";
import { rateLimitMiddleware } from "@/middlewares/ratelimit.middleware";

const router = Router();

router.post(
	"/waitlist",
	rateLimitMiddleware,
	v1Controllers.publicControllers.waitlist.submitWaitlist,
);
router.post(
	"/contact",
	rateLimitMiddleware,
	v1Controllers.publicControllers.contactForm.captureContactForm,
);

export default router;
