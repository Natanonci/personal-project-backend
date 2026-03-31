import createHttpError from 'http-errors';
import { prisma } from '../lib/prisma.js';

export async function createMedia(req, res, next) {
    try {
        const reviewId = +req.params.id;
        const userId = +req.user.id;

        // 1. รับค่ามาจาก Body (ไม่ว่าจะเป็น form-data หรือ raw JSON ก็รับได้)
        const { store_type, pet_type, url } = req.body;

        // 2. จัดการรูปภาพ (รองรับทั้งไฟล์จริง และ Mock URL สำหรับเทสต์)
        let imageUrl = "";
        
        if (req.file) {
            // กรณีอัปโหลดไฟล์จริงผ่าน Multer
            imageUrl = req.file.path.replace(/\\/g, '/');
        } else if (url) {
            // กรณีเทสต์ส่ง raw JSON ผ่าน Postman
            imageUrl = url; 
        } else {
            return next(createHttpError(400, 'Please provide an image file or a mock url.'));
        }

        // 3. เช็คค่าบังคับ (เอา Comment ออกเถอะครับ ป้องกัน Database Error)
        if (!store_type || !pet_type) {
            return next(createHttpError(400, 'store_type and pet_type are required'));
        }

        // 4. ตรวจสอบ Review และเช็คสิทธิ์
        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: { store: true }
        });

        if (!review) {
            return next(createHttpError(404, 'Review not found'));
        }

        if (review.user_id !== userId) {
            return next(createHttpError(403, "You don't have permission to add media to this review"));
        }

        // 5. บันทึกข้อมูลลงตาราง Media
        const newMedia = await prisma.media.create({
            data: {
                url: imageUrl, 
                model_id: reviewId,
                store_type: store_type, 
                pet_type: +pet_type,

                review_id: reviewId,    
                store_id: review.store_id 
            }
        });

        return res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            media: newMedia
        });

    } catch (error) {
        next(error);
    }
}

export async function getAllMedia(req, res, next) {
    try {
        // ดึงข้อมูล Media ทั้งหมด (สามารถดึงข้อมูลรีวิวและคนรีวิวมาโชว์พร้อมรูปได้ด้วย)
        const allMedia = await prisma.media.findMany({
            include: {
                review: {
                    select: {
                        rating: true,
                        comment: true,
                        store_id: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                profile_image: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                id: 'desc' // เรียงจากรูปล่าสุดไปรูปเก่าสุด
            }
        });

        return res.status(200).json({
            success: true,
            count: allMedia.length,
            data: allMedia
        });

    } catch (error) {
        next(error);
    }
};

export const deleteMedia = async (req, res, next) => {
    try {
        const mediaId = +req.params.id;
        const userId = +req.user.id;

        // ดึง Media มา และต้อง include review มาด้วยเพื่อเอา user_id มาเช็คสิทธิ์
        const media = await prisma.media.findUnique({ 
            where: { id: mediaId },
            include: { review: true } 
        });

        if (!media) {
            return next(createHttpError(404, 'Media not found'));
        }

        // เช็คว่าคนที่ลบ เป็นเจ้าของรีวิวนั้นจริงๆ
        if (media.review.user_id !== userId) {
            return next(createHttpError(403, "You don't have permission"));
        }

        await prisma.media.delete({ where: { id: mediaId } });

        return res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
        next(error);
    }
}