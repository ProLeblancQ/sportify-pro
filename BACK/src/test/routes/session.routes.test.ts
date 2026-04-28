process.env.JWT_SECRET = 'test_secret'

import request from 'supertest'
import jwt from 'jsonwebtoken'
jest.mock('../../services/session.service')
import * as sessionService from '../../services/session.service'
import app from '../../app'

const clientToken = jwt.sign({ id: 1, role: 'client' }, 'test_secret')
const coachToken  = jwt.sign({ id: 2, role: 'coach' },  'test_secret')
const adminToken  = jwt.sign({ id: 3, role: 'admin' },  'test_secret')

describe('Session Routes', () => {
  const mockSession = {
    id: 1, title: 'Yoga', scheduled_at: new Date().toISOString(),
    duration_min: 60, max_spots: 10, available_spots: 10, status: 'open',
  }

  describe('GET /sessions', () => {
    it('répond 401 sans token', async () => {
      // Arrange / Act
      const res = await request(app).get('/sessions')

      // Assert
      expect(res.status).toBe(401)
    })

    it('répond 200 avec un token valide', async () => {
      // Arrange
      ;(sessionService.getAllSessions as jest.Mock).mockResolvedValue([mockSession])

      // Act
      const res = await request(app)
        .get('/sessions')
        .set('Authorization', `Bearer ${clientToken}`)

      // Assert
      expect(res.status).toBe(200)
    })
  })

  describe('POST /sessions', () => {
    it('répond 403 si le rôle est client', async () => {
      // Arrange / Act
      const res = await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ title: 'Yoga', duration_min: 60, max_spots: 10 })

      // Assert
      expect(res.status).toBe(403)
    })

    it('répond 201 avec le token coach', async () => {
      // Arrange
      ;(sessionService.createSession as jest.Mock).mockResolvedValue(mockSession)

      // Act
      const res = await request(app)
        .post('/sessions')
        .set('Authorization', `Bearer ${coachToken}`)
        .send({ title: 'Yoga', scheduled_at: '2026-06-01T10:00', duration_min: 60, max_spots: 10 })

      // Assert
      expect(res.status).toBe(201)
    })
  })

  describe('GET /sessions/coach/me', () => {
    it('répond 200 avec le token coach', async () => {
      // Arrange
      ;(sessionService.getCoachSessions as jest.Mock).mockResolvedValue([mockSession])

      // Act
      const res = await request(app)
        .get('/sessions/coach/me')
        .set('Authorization', `Bearer ${coachToken}`)

      // Assert
      expect(res.status).toBe(200)
    })
  })

  describe('GET /sessions/:id', () => {
    it('répond 200 avec un token valide', async () => {
      // Arrange
      ;(sessionService.getSessionById as jest.Mock).mockResolvedValue({ ...mockSession, bookings: [] })

      // Act
      const res = await request(app)
        .get('/sessions/1')
        .set('Authorization', `Bearer ${coachToken}`)

      // Assert
      expect(res.status).toBe(200)
    })

    it('répond 404 si la session est introuvable', async () => {
      // Arrange
      ;(sessionService.getSessionById as jest.Mock).mockResolvedValue(null)

      // Act
      const res = await request(app)
        .get('/sessions/99')
        .set('Authorization', `Bearer ${coachToken}`)

      // Assert
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE /sessions/:id', () => {
    it('répond 403 si le rôle est coach', async () => {
      // Arrange / Act
      const res = await request(app)
        .delete('/sessions/1')
        .set('Authorization', `Bearer ${coachToken}`)

      // Assert
      expect(res.status).toBe(403)
    })

    it('répond 204 avec le token admin', async () => {
      // Arrange
      ;(sessionService.deleteSession as jest.Mock).mockResolvedValue(undefined)

      // Act
      const res = await request(app)
        .delete('/sessions/1')
        .set('Authorization', `Bearer ${adminToken}`)

      // Assert
      expect(res.status).toBe(204)
    })
  })
})
