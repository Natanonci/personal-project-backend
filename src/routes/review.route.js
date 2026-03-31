import express from 'express'
import { createReview, deleteReview, editReview, getReview } from '../controllers/reviews.controller.js'
import authenticate from '../middlewares/auth.middleware.js'

const reviewRouter = express.Router()

reviewRouter.get('/store/:id', getReview)
reviewRouter.post('/store/:id', authenticate, createReview)
reviewRouter.put('/store/:id', authenticate, editReview)
reviewRouter.delete('/store/:id', authenticate, deleteReview)

export default reviewRouter