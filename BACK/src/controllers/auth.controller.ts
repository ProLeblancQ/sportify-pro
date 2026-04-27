import type { Request, Response } from 'express'
import * as authService from '../services/auth.service'

export const register = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body
    const user = await authService.register(first_name, last_name, email, password)
    res.status(201).json(user)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.status(200).json(result)
  } catch (err: any) {
    res.status(401).json({ message: err.message })
  }
}