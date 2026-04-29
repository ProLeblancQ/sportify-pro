import { Request, Response, NextFunction } from 'express'
import * as sessionService from '../services/session.service'

export const getSessionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await sessionService.getSessionById(Number(req.params.id))
    if (!session) {
      const err: any = new Error('Session introuvable')
      err.status = 404
      return next(err)
    }
    res.json(session)
  } catch (err) {
    next(err)
  }
}

export const getAllSessions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await sessionService.getAllSessions()
    res.json(sessions)
  } catch (err) {
    next(err)
  }
}

export const createSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user!.id
    const session = await sessionService.createSession({ ...req.body, user_id })
    res.status(201).json(session)
  } catch (err) {
    next(err)
  }
}

export const deleteSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await sessionService.deleteSession(Number(req.params.id))
    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

export const getCoachSessions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sessions = await sessionService.getCoachSessions(req.user!.id)
    res.json(sessions)
  } catch (err) {
    next(err)
  }
}
