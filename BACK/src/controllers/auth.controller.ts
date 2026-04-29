import type { Request, Response, NextFunction } from 'express'
import * as authService from '../services/auth.service'

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { first_name, last_name, email, password } = req.body
    const user = await authService.register(first_name, last_name, email, password)
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.status(200).json(result)
  } catch (err: any) {
    err.status = 401
    next(err)
  }
}
