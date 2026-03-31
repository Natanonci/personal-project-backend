import express from "express"
import authRouter from "./routes/auth.route.js"
import errorMiddleware from "./middlewares/error.middleware.js"
import notFoundMiddleware from './middlewares/notFound.middleware.js'
import storeRouter from "./routes/store.route.js"
import reservationRouter from "./routes/reservation.route.js"
import historyRouter from "./routes/history.route.js"
import reviewRouter from "./routes/review.route.js"
import mediaRouter from "./routes/media.route.js"
import cors from 'cors'

const app = express()

app.use(express.json())

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}))

app.use('/api/auth', authRouter)
app.use('/store', storeRouter)
app.use('/reservations', reservationRouter)
app.use('/history', historyRouter)
app.use('/reviews', reviewRouter)
app.use('/media', mediaRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app