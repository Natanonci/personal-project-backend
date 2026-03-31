import { prisma } from '../lib/prisma.js'
import createHttpError from 'http-errors'

export async function getHistory(req, res, next) {
  const history = await prisma.historyReservation.findMany()
  res.json(history)
}

export async function getHistoryById(req, res, next) {
    const userId = +req.params.id
    
        const historyReservations = await prisma.historyReservation.findMany({
            where: { user_id: userId },
            include: {
                reservation: true,
            },
        })
        if (!historyReservations || historyReservations.length === 0) {
            throw createHttpError(404, "Reservations not found");
        }
    
        res.json(historyReservations)
    }

