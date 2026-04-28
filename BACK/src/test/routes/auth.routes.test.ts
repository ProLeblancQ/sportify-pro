process.env.JWT_SECRET = 'test_secret'

import request from 'supertest'
jest.mock('../../services/auth.service')
import * as authService from '../../services/auth.service'
import app from '../../app'

describe('Auth Routes', () => {
  describe('POST /auth/register', () => {
    it("répond 201 avec l'utilisateur créé", async () => {
      // Arrange
      const mockUser = { id: 1, email: 'jean@test.com' }
      ;(authService.register as jest.Mock).mockResolvedValue(mockUser)

      // Act
      const res = await request(app)
        .post('/auth/register')
        .send({ first_name: 'Jean', last_name: 'Dupont', email: 'jean@test.com', password: 'pass' })

      // Assert
      expect(res.status).toBe(201)
      expect(res.body).toEqual(mockUser)
    })

    it("répond 400 si l'email est déjà utilisé", async () => {
      // Arrange
      ;(authService.register as jest.Mock).mockRejectedValue(new Error('Email déjà utilisé'))

      // Act
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'jean@test.com', password: 'pass' })

      // Assert
      expect(res.status).toBe(400)
      expect(res.body.message).toBe('Email déjà utilisé')
    })
  })

  describe('POST /auth/login', () => {
    it('répond 200 avec le token', async () => {
      // Arrange
      ;(authService.login as jest.Mock).mockResolvedValue({
        token: 'jwt_token',
        user: { id: 1, email: 'jean@test.com', role: 'client' },
      })

      // Act
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'jean@test.com', password: 'pass' })

      // Assert
      expect(res.status).toBe(200)
      expect(res.body.token).toBe('jwt_token')
    })

    it('répond 401 si les identifiants sont incorrects', async () => {
      // Arrange
      ;(authService.login as jest.Mock).mockRejectedValue(new Error('Mot de passe incorrect'))

      // Act
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'jean@test.com', password: 'wrong' })

      // Assert
      expect(res.status).toBe(401)
    })
  })
})
