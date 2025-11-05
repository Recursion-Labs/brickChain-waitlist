import { db } from "@/config/database";
import catchAsync from "@/handlers/async.handler";
import type { Request, Response } from "express";

const getStats = catchAsync(async (req: Request, res: Response) => {
	// Get waitlist stats
	const waitlistTotal = await db.waitlists.count();
	const waitlistToday = await db.waitlists.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setHours(0, 0, 0, 0)),
			},
		},
	});
	const waitlistThisWeek = await db.waitlists.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 7)),
			},
		},
	});
	const waitlistThisMonth = await db.waitlists.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 30)),
			},
		},
	});

	// Get contact form stats
	const contactTotal = await db.contactUs.count();
	const contactToday = await db.contactUs.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setHours(0, 0, 0, 0)),
			},
		},
	});
	const contactThisWeek = await db.contactUs.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 7)),
			},
		},
	});
	const contactThisMonth = await db.contactUs.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 30)),
			},
		},
	});

	const stats = {
		waitlist: {
			total: waitlistTotal,
			today: waitlistToday,
			thisWeek: waitlistThisWeek,
			thisMonth: waitlistThisMonth,
		},
		contact: {
			total: contactTotal,
			today: contactToday,
			thisWeek: contactThisWeek,
			thisMonth: contactThisMonth,
		},
		overall: {
			totalSubmissions: waitlistTotal + contactTotal,
			todaySubmissions: waitlistToday + contactToday,
			thisWeekSubmissions: waitlistThisWeek + contactThisWeek,
			thisMonthSubmissions: waitlistThisMonth + contactThisMonth,
		},
	};

	res.status(200).json({
		status: "success",
		data: stats,
	});
});

const getWaitlistStats = catchAsync(async (req: Request, res: Response) => {
	const total = await db.waitlists.count();
	const today = await db.waitlists.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setHours(0, 0, 0, 0)),
			},
		},
	});
	const thisWeek = await db.waitlists.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 7)),
			},
		},
	});
	const thisMonth = await db.waitlists.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 30)),
			},
		},
	});

	res.status(200).json({
		status: "success",
		data: {
			total,
			today,
			thisWeek,
			thisMonth,
		},
	});
});

const getContactStats = catchAsync(async (req: Request, res: Response) => {
	const total = await db.contactUs.count();
	const today = await db.contactUs.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setHours(0, 0, 0, 0)),
			},
		},
	});
	const thisWeek = await db.contactUs.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 7)),
			},
		},
	});
	const thisMonth = await db.contactUs.count({
		where: {
			createdAt: {
				gte: new Date(new Date().setDate(new Date().getDate() - 30)),
			},
		},
	});

	res.status(200).json({
		status: "success",
		data: {
			total,
			today,
			thisWeek,
			thisMonth,
		},
	});
});

export default {
	getStats,
	getWaitlistStats,
	getContactStats,
};