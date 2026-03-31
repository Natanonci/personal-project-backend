import createError from "http-errors"
import jwt from 'jsonwebtoken'
import { prisma } from "../lib/prisma.js"

export default async function authenticate(req, res, next) {
    const authorization = req.headers.authorization
    // console.log(authorization)
    if (!authorization || !authorization.startsWith('Bearer ')) {
        return next(createError[401]('Unauthorization'))
    }
    const token = authorization?.split(' ')[1]
    // console.log(token)

    if (!token) {
        return next(createError[401]('Unauthorization Token'))
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // console.log(payload)

    const foundUser = await prisma.user.findUnique({
        where: { id: payload.id }
    })
    // console.log(foundUser)

    if (!foundUser) {
        return next(createError[401]('Unauthorization User'))
    }

    const { password, createdAt, updatedAt, ...userInfo } = foundUser
    req.user = userInfo
    // console.log(req.user)

    next()
}