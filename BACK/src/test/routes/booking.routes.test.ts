process.env.JWT_SECRET = 'test_secret'

import request from 'supertest'
import jwt from 'jsonwebtoken'
jest.mock('../../services/booking.service')
import * as bookingService from '../../services/booking.service'
import app from '../../app'

const clientToken = jwt.sign({ id: 1, role: 'client' }, 'test_secret')

describe('Booking Routes', () => {
  const mockBooking = { id: 1, user_id: 1, session_id: 1, status: 'confirmed' }

  describe('GET /bookings/me', () => {
    it('répond 401 sans token', async () => {
      // Arrange / Act
      const res = await request(app).get('/bookings/me')

      // Assert
      expect(res.status).toBe(401)
    })

    it('répond 200 avec les réservations du client', async () => {
      // Arrange
      ;(bookingService.getMyBookings as jest.Mock).mockResolvedValue([mockBooking])

      // Act
      const res = await request(app)
        .get('/bookings/me')
        .set('Authorization', `Bearer ${clientToken}`)

      // Assert
      expect(res.status).toBe(200)
      expect(res.body).toEqual([mockBooking])
    })
  })

  describe('POST /bookings', () => {
    it('répond 401 sans token', async () => {
      // Arrange / Act
      const res = await request(app).post('/bookings').send({ session_id: 1 })

      // Assert
      expect(res.status).toBe(401)
    })

    it('répond 201 après réservation', async () => {
      // Arrange
      ;(bookingService.createBooking as jest.Mock).mockResolvedValue(mockBooking)

      // Act
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ session_id: 1 })

      // Assert
      expect(res.status).toBe(201)
      expect(res.body).toEqual(mockBooking)
    })

    it('répond 400 si la règle métier est violée', async () => {
      // Arrange
      ;(bookingService.createBooking as jest.Mock).mockRejectedValue(
        new Error('Tu es déjà inscrit à cette session')
      )

      // Act
      const res = await request(app)
        .post('/bookings')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ session_id: 1 })

      // Assert
      expect(res.status).toBe(400)
    })
  })

  describe('DELETE /bookings/:id', () => {
    it('répond 401 sans token', async () => {
      // Arrange / Act
      const res = await request(app).delete('/bookings/1')

      // Assert
      expect(res.status).toBe(401)
    })

    it('répond 204 après annulation', async () => {
      // Arrange
      ;(bookingService.cancelBooking as jest.Mock).mockResolvedValue(undefined)

      // Act
      const res = await request(app)
        .delete('/bookings/1')
        .set('Authorization', `Bearer ${clientToken}`)

      // Assert
      expect(res.status).toBe(204)
    })
  })
})
