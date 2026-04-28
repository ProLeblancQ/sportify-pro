jest.mock('../../services/auth.service')
import * as authService from '../../services/auth.service'
import { register, login } from '../../controllers/auth.controller'

const mockReq = (overrides: any = {}) =>
  ({ body: {}, params: {}, user: null, ...overrides }) as any

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

describe('AuthController', () => {
  const mockUser = { id: 1, first_name: 'Jean', email: 'jean@test.com' }

  describe('register', () => {
    it("répond 201 avec l'utilisateur créé", async () => {
      // Arrange
      ;(authService.register as jest.Mock).mockResolvedValue(mockUser)
      const req = mockReq({ body: { first_name: 'Jean', last_name: 'Dupont', email: 'jean@test.com', password: 'pass' } })
      const res = mockRes()

      // Act
      await register(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockUser)
    })

    it("répond 400 si l'email est déjà utilisé", async () => {
      // Arrange
      ;(authService.register as jest.Mock).mockRejectedValue(new Error('Email déjà utilisé'))
      const req = mockReq({ body: {} })
      const res = mockRes()

      // Act
      await register(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ message: 'Email déjà utilisé' })
    })
  })

  describe('login', () => {
    it('répond 200 avec le token et les infos utilisateur', async () => {
      // Arrange
      const mockResult = { token: 'jwt_token', user: { id: 1, email: 'jean@test.com', role: 'client' } }
      ;(authService.login as jest.Mock).mockResolvedValue(mockResult)
      const req = mockReq({ body: { email: 'jean@test.com', password: 'pass' } })
      const res = mockRes()

      // Act
      await login(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(mockResult)
    })

    it('répond 401 si les identifiants sont incorrects', async () => {
      // Arrange
      ;(authService.login as jest.Mock).mockRejectedValue(new Error('Mot de passe incorrect'))
      const req = mockReq({ body: { email: 'jean@test.com', password: 'wrong' } })
      const res = mockRes()

      // Act
      await login(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe incorrect' })
    })
  })
})
