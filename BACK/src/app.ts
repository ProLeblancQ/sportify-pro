import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import sessionRoutes from './routes/session.routes'
import bookingRoutes from './routes/booking.routes'
import userRoutes from './routes/user.routes'
import coachRoutes from './routes/coach.routes'
import { errorMiddleware } from './middlewares/error.middleware'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/sessions', sessionRoutes)
app.use('/bookings', bookingRoutes)
app.use('/users', userRoutes)
app.use('/coaches', coachRoutes)

app.use(errorMiddleware)

export default app
