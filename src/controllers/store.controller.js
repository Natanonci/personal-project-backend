import { prisma } from "../lib/prisma.js"
import createHttpError from 'http-errors'

export async function getAllStores(req, res, next) {
    const stores = await prisma.store.findMany({})
    res.json(stores)
}

export async function getStoreById(req, res, next) {
    const storeId = +req.params.id
    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store) throw createHttpError(409, "Store Id not found")
    return res.status(200).json(store)
}

export async function createStore(req, res, next) {
    const ownerId = req.user.id
    const { store_type, pet_type, total_storeentry, total_table, total_pet, summary, address, price, open_datetime } = req.body

    const store = await prisma.store.create({
        data: {
            store_type,
            pet_type,
            total_storeentry: +total_storeentry,
            total_table: +total_table,
            total_pet: +total_pet,
            summary,
            address,
            price: +price,
            open_datetime,
            owner_id: ownerId
        },
        select: {
            id: true,
            store_type: true,
            owner_id: true,
        }
    })

    return res.status(201).json({
        message: "Store created successfully",
        data: store
    })
}

export async function updateStore(req, res, next) {
    const storeId = +req.params.id
    const ownerId = +req.user.id
    const { store_type, pet_type, total_storeentry, total_table, total_pet, summary, address, price, open_datetime } = req.body

    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store) {
        return next(createHttpError[404]('Store update ID not found'))
    }

    const result = await prisma.store.update({
        where: { id: storeId },
        data: {
            store_type,
            pet_type,
            total_storeentry: +total_storeentry,
            total_table: +total_table,
            total_pet: +total_pet,
            summary,
            address,
            price: +price,
            open_datetime,
            owner_id: ownerId
        }
    })

    return res.status(200).json({
        message: "Store updated successfully",
        storedata: result
    })
}

export const deleteStore = async (req, res) => {
    const storeId = +req.params.id
    const ownerId = req.user.id

    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store) {
        return next(createHttpError[404]('Store ID not found'))
    }

    if (store.owner_id !== ownerId) {
        return next(createHttpError[403]("You don't have permission"))
    }

    await prisma.store.delete({ where: { id: storeId } })

    return res.status(200).json({ message: "Store deleted successfully" })
}