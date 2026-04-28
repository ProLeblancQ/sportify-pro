jest.mock('../../services/booking.service')
import * as bookingService from '../../services/booking.service'
import { getMyBookings, createBooking, cancelBooking } from '../../controllers/booking.controller'

const mockReq = (overrides: any = {}) =>
  ({ body: {}, params: {}, user: { id: 1, role: 'client' }, ...overrides }) as any

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

describe('BookingController', () => {
  const mockBooking = { id: 1, user_id: 1, session_id: 1, status: 'confirmed', booked_at: new Date() }

  describe('getMyBookings', () => {
    it("répond 200 avec les réservations de l'utilisateur", async () => {
      // Arrange
      ;(bookingService.getMyBookings as jest.Mock).mockResolvedValue([mockBooking])
      const req = mockReq()
      const res = mockRes()

      // Act
      await getMyBookings(req, res)

      // Assert
      expect(bookingService.getMyBookings).toHaveBeenCalledWith(1)
      expect(res.json).toHaveBeenCalledWith([mockBooking])
    })
  })

  describe('createBooking', () => {
    it('répond 201 avec la réservation créée', async () => {
      // Arrange
      ;(bookingService.createBooking as jest.Mock).mockResolvedValue(mockBooking)
      const req = mockReq({ body: { session_id: 1 } })
      const res = mockRes()

      // Act
      await createBooking(req, res)

      // Assert
      expect(bookingService.createBooking).toHaveBeenCalledWith(1, 1)
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockBooking)
    })

    it("répond 400 si l'utilisateur est déjà inscrit", async () => {
      // Arrange
      ;(bookingService.createBooking as jest.Mock).mockRejectedValue(
        new Error('Tu es déjà inscrit à cette session')
      )
      const req = mockReq({ body: { session_id: 1 } })
      const res = mockRes()

      // Act
      await createBooking(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Tu es déjà inscrit à cette session' })
    })
  })

  describe('cancelBooking', () => {
    it('répond 204 après annulation', async () => {
      // Arrange
      ;(bookingService.cancelBooking as jest.Mock).mockResolvedValue(undefined)
      const req = mockReq({ params: { id: '1' } })
      const res = mockRes()

      // Act
      await cancelBooking(req, res)

      // Assert
      expect(bookingService.cancelBooking).toHaveBeenCalledWith(1, 1)
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.send).toHaveBeenCalled()
    })

    it("répond 400 si la réservation est introuvable", async () => {
      // Arrange
      ;(bookingService.cancelBooking as jest.Mock).mockRejectedValue(
        new Error('Réservation introuvable')
      )
      const req = mockReq({ params: { id: '99' } })
      const res = mockRes()

      // Act
      await cancelBooking(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })
})
