import { Request, Response } from 'express'
import * as sessionService from '../services/session.service'

export const getAllSessions = async (req: Request, res: Response) => {
  const sessions = await sessionService.getAllSessions()
  res.json(sessions)
}

export const createSession = async (req: Request, res: Response) => {
  try {
    const session = await sessionService.createSession(req.body)
    res.status(201).json(session)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteSession = async (req: Request, res: Response) => {
  try {
    await sessionService.deleteSession(Number(req.params.id))
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getCoachSessions = async (req: Request, res: Response) => {
  const sessions = await sessionService.getCoachSessions(Number(req.params.coachId))
  res.json(sessions)
}