import { Router } from 'express'
import { createBooking, cancelBooking } from '../controllers/booking.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()
router.post('/', authMiddleware, createBooking)
router.delete('/:id', authMiddleware, cancelBooking)

export default router