import jwt from 'jsonwebtoken'
jest.mock('jsonwebtoken')

import { authMiddleware } from '../../middlewares/auth.middleware'

const mockNext = jest.fn()

const mockReq = (authHeader?: string) =>
  ({ headers: authHeader ? { authorization: authHeader } : {} }) as any

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('AuthMiddleware', () => {
  describe('authMiddleware', () => {
    it('attache req.user et appelle next() avec un token valide', () => {
      // Arrange
      const decoded = { id: 1, role: 'client' }
      ;(jwt.verify as jest.Mock).mockReturnValue(decoded)
      const req = mockReq('Bearer valid_token')
      const res = mockRes()

      // Act
      authMiddleware(req, res, mockNext)

      // Assert
      expect(req.user).toEqual(decoded)
      expect(mockNext).toHaveBeenCalled()
    })

    it('répond 401 si le header Authorization est absent', () => {
      // Arrange
      const req = mockReq()
      const res = mockRes()

      // Act
      authMiddleware(req, res, mockNext)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Token manquant' })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('répond 401 si le token est invalide ou expiré', () => {
      // Arrange
      ;(jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid') })
      const req = mockReq('Bearer bad_token')
      const res = mockRes()

      // Act
      authMiddleware(req, res, mockNext)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' })
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
