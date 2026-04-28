const mockPrismaClient = {
  session: { findUnique: jest.fn(), update: jest.fn() },
  booking: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  $transaction: jest.fn(),
}

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockReturnValue(mockPrismaClient),
}))

import { getMyBookings, createBooking, cancelBooking } from '../../services/booking.service'

describe('BookingService', () => {
  const mockSession = {
    id: 1,
    title: 'Yoga',
    scheduled_at: new Date('2026-05-01T10:00:00'),
    duration_min: 60,
    max_spots: 10,
    available_spots: 5,
    status: 'open',
    coach_id: 1,
  }
  const mockBooking = {
    id: 1,
    user_id: 1,
    session_id: 1,
    status: 'confirmed',
    booked_at: new Date(),
  }

  describe('getMyBookings', () => {
    it("retourne les réservations de l'utilisateur", async () => {
      // Arrange
      mockPrismaClient.booking.findMany.mockResolvedValue([mockBooking])

      // Act
      const result = await getMyBookings(1)

      // Assert
      expect(mockPrismaClient.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { user_id: 1 } })
      )
      expect(result).toEqual([mockBooking])
    })
  })

  describe('createBooking', () => {
    it('crée une réservation avec succès', async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue(mockSession)
      mockPrismaClient.booking.findFirst
        .mockResolvedValueOnce(null) // pas de doublon
        .mockResolvedValueOnce(null) // pas de conflit horaire
      mockPrismaClient.booking.create.mockResolvedValue(mockBooking)
      mockPrismaClient.session.update.mockResolvedValue({ ...mockSession, available_spots: 4 })
      mockPrismaClient.$transaction.mockImplementation((ops: Promise<any>[]) => Promise.all(ops))

      // Act
      const result = await createBooking(1, 1)

      // Assert
      expect(result).toEqual(mockBooking)
      expect(mockPrismaClient.booking.create).toHaveBeenCalledWith({
        data: { user_id: 1, session_id: 1 },
      })
    })

    it('lève une erreur si la session est introuvable', async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(createBooking(1, 99)).rejects.toThrow('Séance introuvable')
    })

    it('lève une erreur si plus de places disponibles', async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue({ ...mockSession, available_spots: 0 })

      // Act & Assert
      await expect(createBooking(1, 1)).rejects.toThrow('Plus de places disponibles')
    })

    it("lève une erreur si l'utilisateur est déjà inscrit", async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue(mockSession)
      mockPrismaClient.booking.findFirst.mockResolvedValue(mockBooking)

      // Act & Assert
      await expect(createBooking(1, 1)).rejects.toThrow('Tu es déjà inscrit à cette session')
    })

    it('lève une erreur en cas de conflit de créneau horaire', async () => {
      // Arrange
      mockPrismaClient.session.findUnique.mockResolvedValue(mockSession)
      mockPrismaClient.booking.findFirst
        .mockResolvedValueOnce(null)       // pas de doublon
        .mockResolvedValueOnce(mockBooking) // conflit horaire

      // Act & Assert
      await expect(createBooking(1, 2)).rejects.toThrow('Tu as déjà une réservation sur ce créneau')
    })
  })

  describe('cancelBooking', () => {
    it('supprime la réservation et libère la place', async () => {
      // Arrange
      mockPrismaClient.booking.findUnique.mockResolvedValue(mockBooking)
      mockPrismaClient.booking.delete.mockResolvedValue(mockBooking)
      mockPrismaClient.session.update.mockResolvedValue({ ...mockSession, available_spots: 6 })
      mockPrismaClient.$transaction.mockImplementation((ops: Promise<any>[]) => Promise.all(ops))

      // Act
      await cancelBooking(1, 1)

      // Assert
      expect(mockPrismaClient.booking.delete).toHaveBeenCalledWith({ where: { id: 1 } })
      expect(mockPrismaClient.session.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { available_spots: { increment: 1 } } })
      )
    })

    it("lève une erreur si la réservation n'appartient pas à l'utilisateur", async () => {
      // Arrange
      mockPrismaClient.booking.findUnique.mockResolvedValue({ ...mockBooking, user_id: 999 })

      // Act & Assert
      await expect(cancelBooking(1, 1)).rejects.toThrow('Réservation introuvable')
    })

    it('lève une erreur si la réservation est introuvable', async () => {
      // Arrange
      mockPrismaClient.booking.findUnique.mockResolvedValue(null)

      // Act & Assert
      await expect(cancelBooking(1, 1)).rejects.toThrow('Réservation introuvable')
    })
  })
})
