import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import { APIError } from "@/utils/APIError";
import type { Request, Response } from "express";
import { WaitlistStatus } from "generated/prisma";

const getResponses = catchAsync(async (req: Request, res: Response) => {
	const responses = await db.waitlists.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	});
	res.status(200).json({
		status: "success",
		data: responses,
	});
});

const fetchResponsesByStatus = catchAsync(async (req: Request, res: Response) => {
	const { status } = req.params;

	if (!status) {
		throw new APIError(400, "Status parameter is required");
	}

	const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED'];
	if (!validStatuses.includes(status.toUpperCase())) {
		throw new APIError(400, "Invalid status. Must be one of: PENDING, VERIFIED, REJECTED");
	}

	const responses = await db.waitlists.findMany({
		where: {
			status: status.toUpperCase() as WaitlistStatus
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	res.status(200).json({
		status: "success",
		data: responses,
		count: responses.length
	});
});

const updateWaitlistStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;

	if (!id) {
		throw new APIError(400, "Waitlist ID is required");
	}

	if (!status) {
		throw new APIError(400, "Status is required");
	}

	const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED'];
	if (!validStatuses.includes(status.toUpperCase())) {
		throw new APIError(400, "Invalid status. Must be one of: PENDING, VERIFIED, REJECTED");
	}

	const updatedWaitlist = await db.waitlists.update({
		where: {
			id: id
		},
		data: {
			status: status.toUpperCase() as WaitlistStatus
		}
	});

	res.status(200).json({
		status: "success",
		message: "Waitlist status updated successfully",
		data: updatedWaitlist
	});
});

const bulkUpdateWaitlistStatus = catchAsync(async (req: Request, res: Response) => {
	const { ids, status } = req.body;

	if (!ids || !Array.isArray(ids) || ids.length === 0) {
		throw new APIError(400, "IDs array is required and must not be empty");
	}

	if (!status) {
		throw new APIError(400, "Status is required");
	}

	const validStatuses = ['PENDING', 'VERIFIED', 'REJECTED'];
	if (!validStatuses.includes(status.toUpperCase())) {
		throw new APIError(400, "Invalid status. Must be one of: PENDING, VERIFIED, REJECTED");
	}

	// Validate that all IDs are strings (MongoDB ObjectIds)
	const invalidIds = ids.filter(id => typeof id !== 'string' || !id.trim());
	if (invalidIds.length > 0) {
		throw new APIError(400, "All IDs must be valid strings");
	}

	const result = await db.waitlists.updateMany({
		where: {
			id: {
				in: ids
			}
		},
		data: {
			status: status.toUpperCase() as WaitlistStatus
		}
	});

	res.status(200).json({
		status: "success",
		message: `${result.count} waitlist entries updated successfully`,
		data: {
			updatedCount: result.count,
			status: status.toUpperCase()
		}
	});
});

const getWaitlistById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;

	if (!id) {
		throw new APIError(400, "Waitlist ID is required");
	}

	const waitlist = await db.waitlists.findUnique({
		where: {
			id: id
		}
	});

	if (!waitlist) {
		throw new APIError(404, "Waitlist not found");
	}

	res.status(200).json({
		status: "success",
		data: waitlist
	});
});

export default {
	getResponses,
	fetchResponsesByStatus,
	updateWaitlistStatus,
	bulkUpdateWaitlistStatus,
	getWaitlistById,
};