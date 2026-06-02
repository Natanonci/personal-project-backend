import { response } from "express";
import { prisma } from "../lib/prisma.js";
import createHttpError from 'http-errors'

export async function getMyReservations(req, res, next) {
    const user_id = req.user.id
    const reservation = await prisma.reservation.findMany({
        where:{user_id: user_id},
        include: {
            store: true
        },
        orderBy:{
            created_at:'desc'
        }
    })
    res.json(reservation)
}

export async function getReservationById(req, res, next) {

    const userId = +req.params.id

    const reservations = await prisma.reservation.findMany({
        where: { user_id: userId },
        include: {
            store: true,
            historyReservations: true,
        },
    })
    if (!reservations || reservations.length === 0) {
        throw createHttpError(404, "Reservations not found");
    }

    res.json(reservations)
}


export async function createReservation(req, res, next) {
    try {
        const { id } = req.user;
        const { price, start_date, end_date, total_guest, storeId, store_name } = req.body;
        const checkStore = await prisma.reservation.findFirst({
            where: { user_id: id, store_id: +storeId }
        });
        if (checkStore) throw createHttpError(409, "this user already reserved cafe");

        
        const store = await prisma.store.findUnique({
            where: { id: +storeId }
        });
        if (!store) throw createHttpError(404, "Store not found");

        const reservation = await prisma.reservation.create({
            data: {
                user_id: id,
                store_id: +storeId,
                store_name: store_name,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                total_guest: +total_guest,
                price: +price,

                historyReservations: {
                    create: {
                        user_id: id,
                        store_id: +storeId,
                        store_name: store_name,
                        owner_id: store.owner_id, 
                        pet_type: store.pet_type, 
                        total_table: store.total_table,
                        total_pet: store.total_pet,
                        summary: store.summary,
                        address: store.address,
                        price: +price
                    }
                }
            },
            include: {
                historyReservations: true
            }
        });

        return res.status(201).json({
            success: true,
            message: "Reservation and History created successfully",
            data: reservation
        });
    } catch (error) {
        next(error);
    }
}

export async function editReservation(req, res, next) {
    try {
        const { id } = req.params;
        
        // 1. รับข้อมูลที่ส่งมาจาก Frontend 
        // (สังเกตว่าเราไม่เอา user_id และ store_name มาแล้ว เพราะไม่ได้ใช้)
        const { start_date, end_date, total_guest, price } = req.body;

        // 2. สั่งอัปเดตข้อมูลด้วย Prisma
        const updatedReservation = await prisma.reservation.update({
            where: { 
                id: Number(id) 
            },
            data: {
                // อัปเดตเฉพาะสิ่งที่เปลี่ยน
                start_date: start_date,
                end_date: end_date,
                total_guest: Number(total_guest),
                price: Number(price)
            }
        });

        res.status(200).json({ 
            message: "อัปเดตการจองสำเร็จ", 
            data: updatedReservation 
        });

    } catch (error) {
        console.error("Update Reservation Error:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
    }
};

export const deleteReservation = async (req, res, next) => {
    const reservationId = +req.params.id
    // console.log(reservationId)

    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })
    console.log(reservation)
    if (!reservation) {
        return next(createHttpError[404]('Reservation ID not found'))
    }
    await prisma.reservation.delete({ where: { id: reservationId } })

    res.json({ message: "Reservation cancel" })
}