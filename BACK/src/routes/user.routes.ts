import { Router } from 'express'
import { getAllUsers, updateUserRole, deleteUser, getMe, updateMe } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)
router.get('/', authMiddleware, requireRole('admin'), getAllUsers)
router.put('/:id', authMiddleware, requireRole('admin'), updateUserRole)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUser)

export default router
