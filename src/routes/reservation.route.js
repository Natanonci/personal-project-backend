import express from 'express'
import { createReservation, deleteReservation, editReservation, getMyReservations, getReservationById } from '../controllers/reservation.controller.js'
import authenticate from '../middlewares/auth.middleware.js'

const reservationRouter = express.Router()

reservationRouter.get('/', authenticate, getMyReservations)
reservationRouter.get('/:id', authenticate, getReservationById)
reservationRouter.post('/', authenticate, createReservation)
reservationRouter.put("/:id",authenticate,editReservation)
reservationRouter.delete('/:id', authenticate, deleteReservation)


export default reservationRouter