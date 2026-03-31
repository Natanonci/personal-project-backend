import createHttpError from 'http-errors'
import { prisma } from '../lib/prisma.js'

export async function getReview(req, res, next) {
    try {
        const id = +req.params.id;

        if (!id) {
            throw createHttpError(400, "Store ID is required");
        }

        const reviews = await prisma.review.findMany({
            where: {
                store_id: id
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profile_image: true
                    }
                },
                media: true,
                reservation: {
                    select: {
                        start_date: true,
                        end_date: true
                    }
                }
            }
        });
        res.status(200).json({
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        next(error);
    }
}

export async function createReview(req, res, next) {
    try {
        const storeId = +req.params.id;
        const { reservationId, rating, comment } = req.body;
        const userId = +req.user.id;

        if (!reservationId || !rating || !comment) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        if (isNaN(storeId)) {
            return res.status(400).json({ error: "Invalid store ID" });
        }

        // แก้ไข: เปลี่ยนวงเล็บ [] เป็น ()
        if (rating < 1 || rating > 5) {
            return next(createHttpError(400, 'Please provide a rating between 1 and 5'));
        }

        const checkReservation = await prisma.reservation.findUnique({
            where: { id: +reservationId }
        });

        if (!checkReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        if (checkReservation.user_id !== userId || checkReservation.store_id !== storeId) {
            return res.status(403).json({ error: "You don't have permission to review this reservation" });
        }

        const existingReview = await prisma.review.findUnique({
            where: { reservation_id: +reservationId }
        });

        if (existingReview) {
            return res.status(409).json({ error: "Review for this reservation already exists" });
        }

        const newReview = await prisma.review.create({
            data: {
                reservation_id: +reservationId,
                user_id: userId,
                store_id: storeId,
                rating: +rating,
                comment: comment
            }
        });

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: newReview
        });

    } catch (error) {
        // แก้ไข: เพิ่ม next(error) เพื่อไม่ให้ Request ค้าง
        next(error);
    }
}

export async function editReview(req, res, next) {
    try {
        const reviewId = +req.params.id;
        const userId = +req.user.id;
        const { rating, comment } = req.body;

        // แก้ไข: เปลี่ยนวงเล็บ [] เป็น ()
        if (rating && (rating < 1 || rating > 5)) {
            return next(createHttpError(400, 'Please provide a rating between 1 and 5'));
        }

        const existingReview = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!existingReview) {
            // แก้ไข: เปลี่ยนวงเล็บ [] เป็น ()
            return next(createHttpError(404, 'Review not found'));
        }

        if (existingReview.user_id !== userId) {
            return next(createHttpError(403, 'You are not authorized to update this review'));
        }

        // แก้ไข: อัปเดตข้อมูล (ลบส่วนของการ Create ออกไปเพราะมีฟังก์ชัน createReview แล้ว)
        const result = await prisma.review.update({
            where: { id: reviewId },
            data: {
                rating: rating ? +rating : existingReview.rating, // ถ้าไม่ได้ส่ง rating มา ให้ใช้ค่าเดิม
                comment: comment !== undefined ? comment : existingReview.comment,
            }
        });

        return res.status(200).json({
            message: "Review updated successfully",
            reviewData: result
        });

    } catch (error) {
        next(error);
    }
}

// แก้ไข: เพิ่ม next เข้ามา และครอบ try...catch
export async function deleteReview(req, res, next) {
    try {
        const id = +req.params.id;
        const userId = +req.user.id;

        const review = await prisma.review.findUnique({ where: { id: id } });
        
        if (!review) {
            return next(createHttpError(404, 'Review not found'));
        }

        if (review.user_id !== userId) {
            return next(createHttpError(403, "You don't have permission to delete this review"));
        }

        await prisma.review.delete({ where: { id: id } });

        // แก้ไข: เปลี่ยนคำว่า Store เป็น Review
        return res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        next(error);
    }
}