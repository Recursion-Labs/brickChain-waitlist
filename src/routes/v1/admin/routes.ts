import { v1Controllers } from "@/controllers";
import { authenticate } from "@/middlewares/auth.middleware";
import { Router } from "express";

const router = Router()

router.use(authenticate)

router.get("/contact/responses", v1Controllers.adminControllers.contactForm.contactFormsController.getAllContactForms)

router.get("/waitlist/responses", v1Controllers.adminControllers.waitlist.waitlistController.getResponses)
router.get("/waitlist/responses/status/:status", v1Controllers.adminControllers.waitlist.waitlistController.fetchResponsesByStatus)
router.put("/waitlist/responses/:id", v1Controllers.adminControllers.waitlist.waitlistController.updateWaitlistStatus)
router.put("/waitlist/responses/bulk", v1Controllers.adminControllers.waitlist.waitlistController.bulkUpdateWaitlistStatus)
router.get("/waitlist/responses/:id", v1Controllers.adminControllers.waitlist.waitlistController.getWaitlistById)

router.get("/stats", v1Controllers.adminControllers.stats.statsController.getStats)
router.get("/stats/waitlist", v1Controllers.adminControllers.stats.statsController.getWaitlistStats)
router.get("/stats/contact", v1Controllers.adminControllers.stats.statsController.getContactStats)

export default router;