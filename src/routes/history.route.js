import express from 'express'
import authenticate from '../middlewares/auth.middleware.js'
import { getHistory, getHistoryById } from '../controllers/history.controller.js'

const historyRouter = express.Router()

historyRouter.get('/', authenticate, getHistory)
historyRouter.get('/:id', authenticate, getHistoryById)

export default historyRouter