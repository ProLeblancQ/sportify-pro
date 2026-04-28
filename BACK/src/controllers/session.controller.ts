import { Request, Response } from 'express'
import * as sessionService from '../services/session.service'

export const getSessionById = async (req: Request, res: Response) => {
  try {
    const session = await sessionService.getSessionById(Number(req.params.id))
    if (!session) return res.status(404).json({ message: 'Session introuvable' })
    res.json(session)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const getAllSessions = async (_req: Request, res: Response) => {
  const sessions = await sessionService.getAllSessions()
  res.json(sessions)
}

export const createSession = async (req: Request, res: Response) => {
  try {
    const user_id = req.user!.id
    const session = await sessionService.createSession({ ...req.body, user_id })
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
  try {
    const sessions = await sessionService.getCoachSessions(req.user!.id)
    res.json(sessions)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}