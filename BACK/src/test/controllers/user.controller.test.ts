jest.mock('../../services/user.service')
import * as userService from '../../services/user.service'
import { getAllUsers, updateUserRole, deleteUser } from '../../controllers/user.controller'

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

      // Act
      await getAllUsers(req, res)

      // Assert
      expect(res.json).toHaveBeenCalledWith(mockUsers)
    })

    it('répond 500 en cas d\'erreur serveur', async () => {
      // Arrange
      ;(userService.getAllUsers as jest.Mock).mockRejectedValue(new Error('DB error'))
      const req = mockReq()
      const res = mockRes()

      // Act
      await getAllUsers(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('updateUserRole', () => {
    it("répond 200 avec l'utilisateur mis à jour", async () => {
      // Arrange
      const updated = { ...mockUsers[0], role: { label: 'coach' } }
      ;(userService.updateUserRole as jest.Mock).mockResolvedValue(updated)
      const req = mockReq({ params: { id: '1' }, body: { role: 'coach' } })
      const res = mockRes()

      // Act
      await updateUserRole(req, res)

      // Assert
      expect(userService.updateUserRole).toHaveBeenCalledWith(1, 'coach')
      expect(res.json).toHaveBeenCalledWith(updated)
    })

    it('répond 400 si le rôle est introuvable', async () => {
      // Arrange
      ;(userService.updateUserRole as jest.Mock).mockRejectedValue(new Error('Rôle introuvable'))
      const req = mockReq({ params: { id: '1' }, body: { role: 'superadmin' } })
      const res = mockRes()

      // Act
      await updateUserRole(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Rôle introuvable' })
    })
  })

  describe('deleteUser', () => {
    it("répond 204 après suppression", async () => {
      // Arrange
      ;(userService.deleteUser as jest.Mock).mockResolvedValue(undefined)
      const req = mockReq({ params: { id: '1' } })
      const res = mockRes()

      // Act
      await deleteUser(req, res)

      // Assert
      expect(userService.deleteUser).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })

    it("répond 400 en cas d'erreur", async () => {
      // Arrange
      ;(userService.deleteUser as jest.Mock).mockRejectedValue(new Error('Introuvable'))
      const req = mockReq({ params: { id: '99' } })
      const res = mockRes()

      // Act
      await deleteUser(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})
