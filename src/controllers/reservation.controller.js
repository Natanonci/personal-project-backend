import { response } from "express";
import { prisma } from "../lib/prisma.js";
import createHttpError from 'http-errors'

export async function getMyReservations(req, res, next) {
    const reservation = await prisma.reservation.findMany({})
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
        const { price, start_date, end_date, total_guest, storeId } = req.body;
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
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                total_guest: +total_guest,
                price: +price,

                historyReservations: {
                    create: {
                        user_id: id,
                        store_id: +storeId,
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
    const userId = +req.user.id
    const reservationId = +req.params.id
    const { price, start_date, end_date, total_guest, storeId } = req.body

    const checkRevIdExist = await prisma.reservation.findFirst({ where: { id: reservationId } })
    if (!checkRevIdExist) throw createHttpError(404, "Reservation not Exist")
    const result = await prisma.reservation.update({
        where: { id: reservationId },
        data: {
            user_id: userId,
            store_id: +storeId,
            start_date: start_date,
            end_date: end_date,
            total_guest: +total_guest,
            price: +price,
        }
    })
    res.json(result)
}

export const deleteReservation = async (req, res, next) => {
    const reservationId = +req.params.id

    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } })
    if (!reservation) {
        return next(createHttpError[404]('Reservation ID not found'))
    }
    await prisma.reservation.delete({ where: { id: reservationId } })

    res.json({ message: "Reservation cancel" })
}