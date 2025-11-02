import { v1Controllers } from "@/controllers";
//import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router()

//router.use(authenticate)

router.get("/contact/responses", v1Controllers.adminControllers.contactForm.contactFormsController.getAllContactForms)

router.get("/waitlist/responses", v1Controllers.adminControllers.waitlist.waitlistController.getResponses)

export default router;