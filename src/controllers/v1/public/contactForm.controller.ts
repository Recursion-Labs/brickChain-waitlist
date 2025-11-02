import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { APIError } from "@/utils/APIError";
import { Request, Response } from "express";

const captureContactForm = catchAsync(async (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        throw new APIError(400, "Name, email, and message are required");
    }
    await db.contactUs.create({
        data: {
            name: name,
            email: email,
            message: message
        }
    })
    res.status(200).json({
        status: 'success',
        message: 'Contact form submitted successfully'
    });
    return
})

export default {
    captureContactForm
}