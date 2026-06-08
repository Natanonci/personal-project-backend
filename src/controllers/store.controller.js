import { prisma } from "../lib/prisma.js"
import createHttpError from 'http-errors'

export async function getAllStores(req, res, next) {
   try {
        const { type, search } = req.query; // รับค่าที่หน้าเว็บส่งมา

        // 🟢 สร้างกล่องเก็บเงื่อนไข
        const whereClause = {};

        // เงื่อนไขที่ 1: ถ้ากดเลือกหมวดหมู่มา ต้องตรงหมวดหมู่นั้นเป๊ะๆ
        if (type) {
            whereClause.store_type = type;
        }

        // เงื่อนไขที่ 2: ถ้ามีการพิมพ์ค้นหามา
        if (search) {
            // บังคับให้หา "เฉพาะในชื่อร้าน" หรือ "ประเภทสัตว์" เท่านั้น! ห้ามไปหาใน summary
            whereClause.OR = [
                { store_name: { contains: search} },
                { pet_type: { contains: search} }
            ];
        }

        // ดึงข้อมูลจากฐานข้อมูล
        const stores = await prisma.store.findMany({
            where: whereClause,
            orderBy: {
                created_at: 'desc' // เรียงร้านใหม่ล่าสุดขึ้นก่อน
            }
        });

        res.json(stores);
    } catch (error) {
        console.error("Get Stores Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

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
            store_name,
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
    const { store_name, store_type, pet_type, total_storeentry, total_table, total_pet, summary, address, price, open_datetime } = req.body

    const store = await prisma.store.findUnique({ where: { id: storeId } })
    if (!store) {
        return next(createHttpError[404]('Store update ID not found'))
    }

    const result = await prisma.store.update({
        where: { id: storeId },
        data: {
            store_type,
            store_name,
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