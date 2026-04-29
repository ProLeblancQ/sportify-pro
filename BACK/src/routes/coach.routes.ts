import { Router } from 'express'
import { getCoachProfile } from '../controllers/coach.controller'
import { authMiddleware } from '../middlewares/auth.middleware'

const router = Router()

router.get('/:id', authMiddleware, getCoachProfile)

export default router
