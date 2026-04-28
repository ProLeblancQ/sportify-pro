const mockPrismaClient = {
  user: { findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
  role: { findUnique: jest.fn() },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue(mockPrismaClient),
}))

import { getAllUsers, updateUserRole, deleteUser } from '../../services/user.service'

describe('UserService', () => {
  const mockRole = { id: 2, label: 'coach' }
  const mockUser = {
    id: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean@test.com',
    role: { label: 'client' },
  }

  describe('getAllUsers', () => {
    it('retourne la liste de tous les utilisateurs', async () => {
      // Arrange
      mockPrismaClient.user.findMany.mockResolvedValue([mockUser])

      // Act
      const result = await getAllUsers()

      // Assert
      expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ include: { role: true } })
      )
      expect(result).toEqual([mockUser])
    })
  })

  describe('updateUserRole', () => {
    it("met à jour le rôle d'un utilisateur", async () => {
      // Arrange
      mockPrismaClient.role.findUnique.mockResolvedValue(mockRole)
      mockPrismaClient.user.update.mockResolvedValue({ ...mockUser, role: mockRole })

      // Act
      const result = await updateUserRole(1, 'coach')

      // Assert
      expect(mockPrismaClient.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { role_id: mockRole.id },
      })
      expect(result).toBeDefined()
    })

    it('lève une erreur si le rôle est introuvable', async () => {
      // Arrange
      mockPrismaClient.role.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(updateUserRole(1, 'superadmin'))
        .rejects.toThrow('Rôle introuvable')
    })
  })

  describe('deleteUser', () => {
    it('supprime un utilisateur par id', async () => {
      // Arrange
      mockPrismaClient.user.delete.mockResolvedValue(mockUser)

      // Act
      await deleteUser(1)

      // Assert
      expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })
})
