process.env.JWT_SECRET = 'test_secret'

import request from 'supertest'
import jwt from 'jsonwebtoken'
jest.mock('../../services/user.service')
import * as userService from '../../services/user.service'
import app from '../../app'

const clientToken = jwt.sign({ id: 1, role: 'client' }, 'test_secret')
const adminToken  = jwt.sign({ id: 3, role: 'admin' },  'test_secret')

describe('User Routes', () => {
  const mockUsers = [{ id: 1, email: 'jean@test.com', role: { label: 'client' } }]

  describe('GET /users', () => {
    it('répond 401 sans token', async () => {
      // Arrange / Act
      const res = await request(app).get('/users')

      // Assert
      expect(res.status).toBe(401)
    })

    it('répond 403 avec un rôle non-admin', async () => {
      // Arrange / Act
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${clientToken}`)

      // Assert
      expect(res.status).toBe(403)
    })

    it('répond 200 avec le token admin', async () => {
      // Arrange
      ;(userService.getAllUsers as jest.Mock).mockResolvedValue(mockUsers)

      // Act
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${adminToken}`)

      // Assert
      expect(res.status).toBe(200)
      expect(res.body).toEqual(mockUsers)
    })
  })

  describe('PUT /users/:id', () => {
    it('répond 403 avec un rôle non-admin', async () => {
      // Arrange / Act
      const res = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${clientToken}`)
        .send({ role: 'coach' })

      // Assert
      expect(res.status).toBe(403)
    })

    it('répond 200 avec le token admin', async () => {
      // Arrange
      ;(userService.updateUserRole as jest.Mock).mockResolvedValue({ id: 1, role: { label: 'coach' } })

      // Act
      const res = await request(app)
        .put('/users/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'coach' })

      // Assert
      expect(res.status).toBe(200)
    })
  })

  describe('DELETE /users/:id', () => {
    it('répond 401 sans token', async () => {
      // Arrange / Act
      const res = await request(app).delete('/users/1')

      // Assert
      expect(res.status).toBe(401)
    })

    it('répond 204 avec le token admin', async () => {
      // Arrange
      ;(userService.deleteUser as jest.Mock).mockResolvedValue(undefined)

      // Act
      const res = await request(app)
        .delete('/users/1')
        .set('Authorization', `Bearer ${adminToken}`)

      // Assert
      expect(res.status).toBe(204)
    })
  })
})
