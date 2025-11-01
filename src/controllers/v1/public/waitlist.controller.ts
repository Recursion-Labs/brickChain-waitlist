import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { APIError } from "@/utils/APIError";
import { Request, Response } from "express";

const submitWaitlist = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        throw new APIError(400, "Missing Required Fields");
    }
    const check = await db.responses.findFirst({
        where: {
            emails: email
         }
    })
    if (check) {
        throw new APIError(400, "Email already submitted to waitlist");
    }
    await db.responses.create({
        data: {
            emails: email
        }
    })
    res.status(200).json({
        status: "success",
        message: "Successfully submitted to waitlist"
    })
    return
})

export default { submitWaitlist }