const mockPrismaClient = {
  session: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  coach: { findUnique: jest.fn() },
  $queryRaw: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue(mockPrismaClient),
}))

import {
  getAllSessions,
  createSession,
  getSessionById,
  deleteSession,
  getCoachSessions,
} from '../../services/session.service'

describe('SessionService', () => {
  const mockCoach = { id: 1, user_id: 1, specialty: 'Yoga', bio: null }
  const mockSession = {
    id: 1,
    title: 'Yoga',
    scheduled_at: new Date('2026-05-01T10:00:00'),
    duration_min: 60,
    max_spots: 10,
    available_spots: 10,
    status: 'open',
    coach_id: 1,
    created_at: new Date(),
  }
  const sessionData = {
    title: 'Yoga',
    scheduled_at: new Date('2026-05-01T10:00:00'),
    duration_min: 60,
    max_spots: 10,
    user_id: 1,
  }

  describe('getAllSessions', () => {
    it('retourne uniquement les sessions ouvertes', async () => {
      // Arrange
      mockPrismaClient.session.findMany.mockResolvedValue([mockSession])

      // Act
      const result = await getAllSessions()

      // Assert
      expect(mockPrismaClient.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'open' } })
      )
      expect(result).toEqual([mockSession])
    })
  })

  describe('createSession', () => {
    it('crée une session avec succès', async () => {
      // Arrange
      mockPrismaClient.coach.findUnique.mockResolvedValue(mockCoach)
      mockPrismaClient.$queryRaw.mockResolvedValue([]) // aucun chevauchement
      mockPrismaClient.session.create.mockResolvedValue(mockSession)

      // Act
      const result = await createSession(sessionData)

      // Assert
      expect(mockPrismaClient.session.create).toHaveBeenCalled()
      expect(result).toEqual(mockSession)
    })

    it('lève une erreur si le profil coach est introuvable', async () => {
      // Arrange
      mockPrismaClient.coach.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(createSession(sessionData))
        .rejects.toThrow('Profil coach introuvable pour cet utilisateur')
    })

    it('lève une erreur si la session chevauche une session existante', async () => {
      // Arrange
      mockPrismaClient.coach.findUnique.mockResolvedValue(mockCoach)
      mockPrismaClient.$queryRaw.mockResolvedValue([{ id: 2 }]) // chevauchement détecté

      // Act & Assert
      await expect(createSession(sessionData))
        .rejects.toThrow('Cette session chevauche une session déjà programmée')
    })
  })

  describe('getSessionById', () => {
    it('retourne la session avec ses réservations', async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue({ ...mockSession, bookings: [] })

      // Act
      const result = await getSessionById(1)

      // Assert
      expect(mockPrismaClient.session.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { bookings: { include: { user: true } } },
      })
      expect(result).toBeDefined()
    })

    it('retourne null si la session est introuvable', async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue(null)

      // Act
      const result = await getSessionById(99)

      // Assert
      expect(result).toBeNull()
    })
  })

  describe('deleteSession', () => {
    it('supprime une session par id', async () => {
      // Arrange
      mockPrismaClient.session.delete.mockResolvedValue(mockSession)

      // Act
      await deleteSession(1)

      // Assert
      expect(mockPrismaClient.session.delete).toHaveBeenCalledWith({ where: { id: 1 } })
    })
  })

  describe('getCoachSessions', () => {
    it('retourne les sessions du coach avec leurs réservations', async () => {
      // Arrange
      mockPrismaClient.coach.findUnique.mockResolvedValue(mockCoach)
      mockPrismaClient.session.findMany.mockResolvedValue([{ ...mockSession, bookings: [] }])

      // Act
      const result = await getCoachSessions(1)

      // Assert
      expect(mockPrismaClient.session.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { coach_id: mockCoach.id } })
      )
      expect(result).toHaveLength(1)
    })

    it('lève une erreur si le profil coach est introuvable', async () => {
      // Arrange
      mockPrismaClient.coach.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(getCoachSessions(1)).rejects.toThrow('Profil coach introuvable')
    })
  })
})
