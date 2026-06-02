import express from "express"
import { me, login, register, editProfile, deleteAccount } from "../controllers/auth.controller.js"
import authenticate from "../middlewares/auth.middleware.js"

const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post('/login', login)
authRouter.get('/me', authenticate, me)
authRouter.patch('/me/profile', authenticate, editProfile)
authRouter.delete('/me', authenticate, deleteAccount)

export default authRouter