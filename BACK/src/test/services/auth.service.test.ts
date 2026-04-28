import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const mockPrismaClient = {
  user: { findUnique: jest.fn(), create: jest.fn() },
  role: { findUnique: jest.fn() },
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue(mockPrismaClient),
}))
jest.mock('bcryptjs')
jest.mock('jsonwebtoken')

import { register, login } from '../../services/auth.service'

describe('AuthService', () => {
  const mockRole = { id: 1, label: 'client' }
  const mockUser = {
    id: 1,
    first_name: 'Jean',
    last_name: 'Dupont',
    email: 'jean@test.com',
    password: 'hashed',
    role_id: 1,
    created_at: new Date(),
    role: mockRole,
  }

  describe('register', () => {
    it('crée un utilisateur avec un mot de passe hashé', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(null)
      mockPrismaClient.role.findUnique.mockResolvedValue(mockRole)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password')
      mockPrismaClient.user.create.mockResolvedValue(mockUser)

      // Act
      const result = await register('Jean', 'Dupont', 'jean@test.com', 'password')

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10)
      expect(mockPrismaClient.user.create).toHaveBeenCalled()
      expect(result).toEqual(mockUser)
    })

    it("lève une erreur si l'email est déjà utilisé", async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)

      // Act & Assert
      await expect(register('Jean', 'Dupont', 'jean@test.com', 'password'))
        .rejects.toThrow('Email déjà utilisé')
    })
  })

  describe('login', () => {
    it('retourne un token et les infos utilisateur avec des identifiants valides', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      ;(jwt.sign as jest.Mock).mockReturnValue('jwt_token')

      // Act
      const result = await login('jean@test.com', 'password')

      // Assert
      expect(result.token).toBe('jwt_token')
      expect(result.user.email).toBe('jean@test.com')
    })

    it("lève une erreur si l'email est introuvable", async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(login('unknown@test.com', 'password'))
        .rejects.toThrow('Utilisateur introuvable')
    })

    it('lève une erreur si le mot de passe est incorrect', async () => {
      // Arrange
      mockPrismaClient.user.findUnique.mockResolvedValue(mockUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)

      // Act & Assert
      await expect(login('jean@test.com', 'wrong'))
        .rejects.toThrow('Mot de passe incorrect')
    })
  })
})
