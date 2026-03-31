import { prisma } from "../lib/prisma.js"

export default async function storeOwner(req, res, next) {
  
  const storeId = Number(req.params.id)
  const ownerId = req.user.id

  const store = await prisma.store.findUnique({ where: { id: storeId } })

  if (!store) {
    return res.status(404).json("Store not found")
  }

  if (store.owner_id !== ownerId) {
    return res.status(403).json("You don't have permission")
  }

  req.store = store
  next()
}