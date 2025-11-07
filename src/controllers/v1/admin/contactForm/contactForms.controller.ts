import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { APIError } from "@/utils/APIError";
import { Request, Response } from "express";
import { ContactStatus } from "generated/prisma";

const getAllContactForms = catchAsync(async (req: Request, res: Response) => {
	const forms = await db.contactUs.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});
	res.status(200).json({
		status: "success",
		data: forms,
	});
});

const updateContactStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	if (!id || id.trim() === "") {
		throw new APIError(400, "Contact ID is required");
	}

	if (!status) {
		throw new APIError(400, "Status is required");
	}

	const validStatuses = Object.values(ContactStatus);
	if (!validStatuses.includes(status.toUpperCase())) {
		throw new APIError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
	}

	const existingContact = await db.contactUs.findUnique({
		where: {
			id: id
		}
	});

	if (!existingContact) {
		throw new APIError(404, "Contact not found");
	}

	const updatedContact = await db.contactUs.update({
		where: {
			id: id
		},
		data: {
			status: status.toUpperCase() as ContactStatus
		}
	});

	res.status(200).json({
		status: "success",
		message: "Contact status updated successfully",
		data: updatedContact
	});
});

export default {
	getAllContactForms,
	updateContactStatus,
};
