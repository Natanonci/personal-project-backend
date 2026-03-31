import { z } from "zod"
import bcrypt from "bcrypt"


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^[0-9]{10,15}$/

const identityKey = value => emailRegex.test(value) ? 'email' : 'mobile'

export const registerSchema = z.object({
    identity: z.string().min(2, "Email or Phone-number must have more than 2 characters")
        .refine(value => emailRegex.test(value) || mobileRegex.test(value), "Email or Mobile phone require"),
    firstName: z.string().min(2, "Firstname must be more than 2 characters"),
    lastName: z.string().min(2, "Lastname must be more than 2 characters"),
    password: z.string().min(4, "Password at least 4 characters"),
    confirmPassword: z.string().min(1, "confirm password is required"),
}).refine(input => input.password === input.confirmPassword, {
    message: "Confirmpassword must match password",
    path: ['Password']
}).transform(async data => ({
    [identityKey(data.identity)]: data.identity,
    password: await bcrypt.hash(data.password, 8),
    firstName: data.firstName,
    lastName: data.lastName,
}))

export const loginSchema = z.object({
    identity: z.string().min(2, "Email or phone-number require")
        .refine(value => emailRegex.test(value) || mobileRegex.test(value), {
            message: "identity must be a valid email or mobile number"
        }),
    password: z.string().min(4, "password at least 4 characters")
}).transform(data => ({
    [identityKey(data.identity)]: data.identity,
    password: data.password
})
)

export const editProfileSchema = z.object({
    identity: z.string().refine(value => emailRegex.test(value) || mobileRegex.test(value), "Email or Mobile phone required").optional(),
    firstName: z.string().min(2, "Firstname must be more than 2 characters").optional(),
    lastName: z.string().min(2, "Lastname must be more than 2 characters").optional(),
    phone_number: z.string().refine(value => mobileRegex.test(value), "Phone number must be 10-15 digits").optional(),
    profile_image: z.string().min(1, "profile_image cannot be empty").optional(),
}).transform(data => ({
    ...(data.identity && { [identityKey(data.identity)]: data.identity }),
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.phone_number && { phone_number: data.phone_number }),
    ...(data.profile_image && { profile_image: data.profile_image }),
}))