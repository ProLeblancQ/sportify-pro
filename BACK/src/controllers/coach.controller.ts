import { Request, Response, NextFunction } from 'express'
import * as coachService from '../services/coach.service'

export const getCoachProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coach = await coachService.getCoachById(Number(req.params.id))
    if (!coach) {
      const err: any = new Error('Coach introuvable')
      err.status = 404
      return next(err)
    }
    res.json(coach)
  } catch (err) {
    next(err)
  }
}
