import { Request, Response } from 'express'
import * as userService from '../services/user.service'

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { role } = req.body
    const user = await userService.updateUserRole(Number(req.params.id), role)
    res.json(user)
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(Number(req.params.id))
    res.status(204).send()
  } catch (err: any) {
    res.status(400).json({ message: err.message })
  }
}