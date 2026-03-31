import createHttpError from 'http-errors'
import { prisma } from '../lib/prisma.js'
import { createUser, getUserBy } from '../services/user.service.js'
import { editProfileSchema, loginSchema, registerSchema } from '../validations/schema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export async function register(req, res, next) {

    const data = await registerSchema.parseAsync(req.body)
    const identityKey = data.email ? 'email' : 'mobile'
    const haveUser = await getUserBy(identityKey, data[identityKey])

    if (haveUser) {
        return next(createHttpError[409]('This user already register'))
    }

    const result = await createUser(data)
    const userInfo = {
        id: result.id,
        [identityKey]: data.identityKey,
        firstName: result.firstName,
        lastName: result.lastName,
    }
    res.json({
        message: 'Register Successful',
        user: userInfo
    })
}

export async function login(req, res, next) {

    const data = loginSchema.parse(req.body)
    const identityKey = data.email ? 'email' : 'mobile'

    const foundUser = await prisma.user.findFirst({
        where: { [identityKey]: data[identityKey] }
    })

    if (!foundUser) {
        return next(createHttpError[401]('User not found'))
    }

    const psw = await bcrypt.compare(data.password, foundUser.password)

    if (!psw) {
        return next(createHttpError[401]('Please re-checked your password'))
    }

    const payload = { id: foundUser.id }
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '30d'
    })

    const { password, createAt, updatedAt, ...userInfo } = foundUser
    res.send({
        message: 'Login success',
        token: token,
        user: userInfo
    })
}

export async function me(req, res, next) {
    res.send({ user: req.user })
}

export async function editProfile(req, res, next) {

    const userId = req.user.id

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
        return res.status(404).json("User not found")
    }

    const updateData = await editProfileSchema.parseAsync(req.body)
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone_number: true,
            profile_image: true,
        }
    })

    return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser
    })
}

export const deleteAccount = async (req, res) => {
  const userId = req.user.id
 
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return res.status(404).json({ error: "User not found" })
  }
 
  await prisma.user.delete({ where: { id: userId } })
 
  return res.status(200).json({
    success: true,
    message: "Account deleted successfully"
  })
}