jest.mock('../../services/session.service')
import * as sessionService from '../../services/session.service'
import {
  getAllSessions,
  createSession,
  deleteSession,
  getCoachSessions,
  getSessionById,
} from '../../controllers/session.controller'

const mockReq = (overrides: any = {}) =>
  ({ body: {}, params: {}, user: { id: 1, role: 'coach' }, ...overrides }) as any

const mockRes = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  res.send = jest.fn().mockReturnValue(res)
  return res
}

describe('SessionController', () => {
  const mockSession = {
    id: 1,
    title: 'Yoga',
    scheduled_at: new Date(),
    duration_min: 60,
    max_spots: 10,
    available_spots: 10,
    status: 'open',
  }

  describe('getAllSessions', () => {
    it('répond 200 avec la liste des sessions', async () => {
      // Arrange
      ;(sessionService.getAllSessions as jest.Mock).mockResolvedValue([mockSession])
      const req = mockReq()
      const res = mockRes()

      // Act
      await getAllSessions(req, res)

      // Assert
      expect(res.json).toHaveBeenCalledWith([mockSession])
    })
  })

  describe('createSession', () => {
    it('répond 201 avec la session créée', async () => {
      // Arrange
      ;(sessionService.createSession as jest.Mock).mockResolvedValue(mockSession)
      const req = mockReq({ body: { title: 'Yoga', duration_min: 60, max_spots: 10 } })
      const res = mockRes()

      // Act
      await createSession(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockSession)
    })

    it('répond 400 si le profil coach est introuvable', async () => {
      // Arrange
      ;(sessionService.createSession as jest.Mock).mockRejectedValue(
        new Error('Profil coach introuvable pour cet utilisateur')
      )
      const req = mockReq({ body: {} })
      const res = mockRes()

      // Act
      await createSession(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  describe('deleteSession', () => {
    it('répond 204 après suppression', async () => {
      // Arrange
      ;(sessionService.deleteSession as jest.Mock).mockResolvedValue(undefined)
      const req = mockReq({ params: { id: '1' } })
      const res = mockRes()

      // Act
      await deleteSession(req, res)

      // Assert
      expect(sessionService.deleteSession).toHaveBeenCalledWith(1)
      expect(res.status).toHaveBeenCalledWith(204)
    })

    it("répond 400 en cas d'erreur", async () => {
      // Arrange
      ;(sessionService.deleteSession as jest.Mock).mockRejectedValue(new Error('Introuvable'))
      const req = mockReq({ params: { id: '99' } })
      const res = mockRes()

      // Act
      await deleteSession(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  describe('getCoachSessions', () => {
    it('répond 200 avec les sessions du coach', async () => {
      // Arrange
      ;(sessionService.getCoachSessions as jest.Mock).mockResolvedValue([mockSession])
      const req = mockReq()
      const res = mockRes()

      // Act
      await getCoachSessions(req, res)

      // Assert
      expect(sessionService.getCoachSessions).toHaveBeenCalledWith(1)
      expect(res.json).toHaveBeenCalledWith([mockSession])
    })

    it('répond 400 si le profil coach est introuvable', async () => {
      // Arrange
      ;(sessionService.getCoachSessions as jest.Mock).mockRejectedValue(
        new Error('Profil coach introuvable')
      )
      const req = mockReq()
      const res = mockRes()

      // Act
      await getCoachSessions(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(400)
    })
  })

  describe('getSessionById', () => {
    it('répond 200 avec le détail de la session', async () => {
      // Arrange
      ;(sessionService.getSessionById as jest.Mock).mockResolvedValue({ ...mockSession, bookings: [] })
      const req = mockReq({ params: { id: '1' } })
      const res = mockRes()

      // Act
      await getSessionById(req, res)

      // Assert
      expect(sessionService.getSessionById).toHaveBeenCalledWith(1)
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }))
    })

    it('répond 404 si la session est introuvable', async () => {
      // Arrange
      ;(sessionService.getSessionById as jest.Mock).mockResolvedValue(null)
      const req = mockReq({ params: { id: '99' } })
      const res = mockRes()

      // Act
      await getSessionById(req, res)

      // Assert
      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ message: 'Session introuvable' })
    })
  })
})
