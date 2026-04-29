import { Router } from 'express'
import { getAllUsers, updateUserRole, deleteUser, getMe, updateMe, uploadAvatar } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth.middleware'
import { requireRole } from '../middlewares/role.middleware'
import { uploadMiddleware } from '../middlewares/upload.middleware'

const router = Router()

router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)
router.post('/me/avatar', authMiddleware, uploadMiddleware.single('avatar'), uploadAvatar)
router.get('/', authMiddleware, requireRole('admin'), getAllUsers)
router.put('/:id', authMiddleware, requireRole('admin'), updateUserRole)
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUser)

export default router
