import { Router } from 'express'
import { getMyBookings, createBooking, cancelBooking } from '../controllers/booking.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.get('/me', authMiddleware, getMyBookings)
router.post('/', authMiddleware, createBooking)
router.delete('/:id', authMiddleware, cancelBooking)

export default router