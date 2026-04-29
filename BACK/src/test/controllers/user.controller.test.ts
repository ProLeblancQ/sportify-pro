jest.mock('../../services/user.service')
import * as userService from '../../services/user.service'
import { getAllUsers, updateUserRole, deleteUser, getMe, updateMe } from '../../controllers/user.controller'

const mockReq = (overrides: any = {}) =>
  ({ body: {}, params: {}, user: { id: 1, role: 'admin' }, ...overrides }) as any

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

describe('UserController', () => {
  const mockUsers = [
    { id: 1, first_name: 'Jean', email: 'jean@test.com', role: { label: 'client' } },
  ]

  describe('getAllUsers', () => {
    it('répond 200 avec la liste des utilisateurs', async () => {
      // Arrange
      ;(userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers)
      const req = mockReq()
      const res = mockRes()
      const next = jest.fn()

      // Act
      await getAllUsers(req, res, next)

      // Assert
      expect(res.json).toHaveBeenCalledWith(mockUsers)
    })

    it("transmet l'erreur en cas d'échec serveur", async () => {
      // Arrange
      ;(userService.getAllUsers as jest.Mock).mockRejectedValue(new Error('DB error'))
      const req = mockReq()
      const res = mockRes()
      const next = jest.fn()

      // Act
      await getAllUsers(req, res, next)

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('updateUserRole', () => {
    it("répond 200 avec l'utilisateur mis à jour", async () => {
      // Arrange
      const updated = { ...mockUsers[0], role: { label: 'coach' } }
      ;(userService.updateUserRole as jest.Mock).mockResolvedValue(updated)
      const req = mockReq({ params: { id: '1' }, body: { role: 'coach' } })
      const res = mockRes()
      const next = jest.fn()

      // Act
      await updateUserRole(req, res, next)

      // Assert
      expect(userService.updateUserRole).toHaveBeenCalledWith(1, 'coach')
      expect(res.json).toHaveBeenCalledWith(updated)
    })

    it("transmet l'erreur si le rôle est introuvable", async () => {
      // Arrange
      ;(userService.updateUserRole as jest.Mock).mockRejectedValue(new Error('Rôle introuvable'))
      const req = mockReq({ params: { id: '1' }, body: { role: 'superadmin' } })
      const res = mockRes()
      const next = jest.fn()

      // Act
      await updateUserRole(req, res, next)

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('deleteUser', () => {
    it("répond 204 après suppression", async () => {
      // Arrange
      ;(userService.deleteUser as jest.Mock).mockResolvedValue(undefined)
      const req = mockReq({ params: { id: '1' } })
      const res = mockRes()
      const next = jest.fn()

      // Act
      await deleteUser(req, res, next)

      // Assert
      expect(userService.deleteUser).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })

    it("transmet l'erreur en cas d'échec", async () => {
      // Arrange
      ;(userService.deleteUser as jest.Mock).mockRejectedValue(new Error('Introuvable'))
      const req = mockReq({ params: { id: '99' } })
      const res = mockRes()
      const next = jest.fn()

      // Act
      await deleteUser(req, res, next)

      // Assert
      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('getMe', () => {
    it("répond 200 avec le profil de l'utilisateur connecté", async () => {
      // Arrange
      const mockMe = { id: 1, first_name: 'Jean', email: 'jean@test.com', role: { label: 'admin' }, coach: null }
      ;(userService.getMe as jest.Mock).mockResolvedValue(mockMe)
      const req = mockReq({ user: { id: 1 } })
      const res = mockRes()
      const next = jest.fn()

      // Act
      await getMe(req, res, next)

      // Assert
      expect(userService.getMe).toHaveBeenCalledWith(1)
      expect(res.json).toHaveBeenCalledWith(mockMe)
    })
  })

  describe('updateMe', () => {
    it("répond 200 avec le profil mis à jour", async () => {
      // Arrange
      const updated = { id: 1, first_name: 'Jean-Luc', email: 'jean@test.com', role: { label: 'admin' }, coach: null }
      ;(userService.updateMe as jest.Mock).mockResolvedValue(updated)
      const req = mockReq({ user: { id: 1 }, body: { first_name: 'Jean-Luc' } })
      const res = mockRes()
      const next = jest.fn()

      // Act
      await updateMe(req, res, next)

      // Assert
      expect(userService.updateMe).toHaveBeenCalledWith(1, { first_name: 'Jean-Luc' })
      expect(res.json).toHaveBeenCalledWith(updated)
    })
  })
})
