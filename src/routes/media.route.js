import express from "express"
import { createMedia, deleteMedia, getAllMedia } from "../controllers/media.controller.js"
import authenticate from "../middlewares/auth.middleware.js"

const mediaRouter = express.Router()

mediaRouter.get('/:id', getAllMedia)
mediaRouter.post('/:id', authenticate, createMedia)
mediaRouter.delete('/:id', authenticate, deleteMedia)

export default mediaRouter