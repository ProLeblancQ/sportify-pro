import { requireRole } from '../../middlewares/role.middleware'

const mockNext = jest.fn()

const mockReq = (role?: string) =>
  ({ user: role ? { id: 1, role } : undefined }) as any

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('RoleMiddleware', () => {
  describe('requireRole', () => {
    it('appelle next() si le rôle de l\'utilisateur correspond', () => {
      // Arrange
      const middleware = requireRole('coach')
      const req = mockReq('coach')
      const res = mockRes()

      // Act
      middleware(req, res, mockNext)

      // Assert
      expect(mockNext).toHaveBeenCalled()
      expect(res.status).not.toHaveBeenCalled()
    })

    it('répond 403 si le rôle ne correspond pas', () => {
      // Arrange
      const middleware = requireRole('admin')
      const req = mockReq('client')
      const res = mockRes()

      // Act
      middleware(req, res, mockNext)

      // Assert
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('répond 403 si req.user est absent', () => {
      // Arrange
      const middleware = requireRole('admin')
      const req = mockReq()
      const res = mockRes()

      // Act
      middleware(req, res, mockNext)

      // Assert
      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ message: 'Accès refusé' })
    })
  })
})
