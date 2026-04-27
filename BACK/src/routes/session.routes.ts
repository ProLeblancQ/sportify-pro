import { Router } from 'express'
import { getAllSessions, createSession, deleteSession, getCoachSessions } from '../controllers/session.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'

const router = Router()
router.get('/', authMiddleware, getAllSessions)
router.post('/', authMiddleware, requireRole('coach'), createSession)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteSession)
router.get('/coach/:coachId', authMiddleware, getCoachSessions)

export default router