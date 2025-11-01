import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { Request, Response } from "express";

const getResponses = catchAsync(async (req: Request, res: Response) => {
    const responses = await db.responses.findMany();
    res.status(200).json({
        status: "success",
        data: responses
    });
});

export default {
    getResponses
}