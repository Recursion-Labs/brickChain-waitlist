import { v1Controllers } from "@/controllers";
import { Router } from "express";

const router = Router()

router.post("/waitlist", v1Controllers.publicControllers.waitlist.submitWaitlist)

export default router;