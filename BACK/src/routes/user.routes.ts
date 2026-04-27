import { Router } from 'express'
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'

const router = Router()

router.get('/', authMiddleware, requireRole('admin'), getAllUsers)
router.put('/:id', authMiddleware, requireRole('admin'), updateUserRole)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUser)

export default router