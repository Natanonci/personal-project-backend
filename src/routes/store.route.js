import express from 'express'
import { createStore, deleteStore, getAllStores, getStoreById, updateStore } from '../controllers/store.controller.js'
import storeOwner from '../middlewares/store.middleware.js'
import authenticate from '../middlewares/auth.middleware.js'

const storeRouter = express.Router()

storeRouter.get("/", getAllStores)
storeRouter.get("/:id", getStoreById)
storeRouter.post("/", authenticate, createStore)
storeRouter.put("/:id", authenticate, storeOwner, updateStore)
storeRouter.delete("/:id", authenticate, storeOwner, deleteStore)

export default storeRouter